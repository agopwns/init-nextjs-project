export const dynamic = "force-dynamic";

import { createServerClient } from '@/lib/supabase'
import { createPaymentCompletedNotification } from '@/actions/notification-actions'

// 포트원 V2 버전 API 호출 예시
// 내부 PG사는 토스페이먼츠 사용
export async function POST(req) {
  try {
    console.log('=== 결제 완료 처리 시작 ===');

    // 요청의 body로 paymentId, reservationId, order가 오기를 기대합니다.
    const body = await req.json();
    const { paymentId, reservationId, order } = body;

    console.log('요청 데이터:', { paymentId, reservationId, order });

    if (!paymentId || !reservationId) {
      console.error('필수 정보 누락:', { paymentId: !!paymentId, reservationId: !!reservationId });
      return Response.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // 환경변수 확인
    if (!process.env.PORTONE_V2_API_SECRET) {
      console.error('PORTONE_V2_API_SECRET 환경변수가 설정되지 않았습니다.');
      return Response.json({ error: '포트원 API 설정이 누락되었습니다.' }, { status: 500 });
    }

    // 서버 사이드 Supabase 클라이언트 생성 (service role 사용)
    const supabase = createServerClient();
    console.log('서버 사이드 Supabase 클라이언트 생성 완료');

    console.log('1. 포트원 결제내역 조회 시작');

    // 1. 포트원 결제내역 단건조회 API 호출
    let payment;
    try {
      const paymentResponse = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
        {
          headers: {
            Authorization: `PortOne ${process.env.PORTONE_V2_API_SECRET}`,
          },
        }
      );

      console.log('포트원 API 응답 상태:', paymentResponse.status);

      if (!paymentResponse.ok) {
        const errorText = await paymentResponse.text();
        console.error('포트원 API 오류:', errorText);
        throw new Error(`포트원 API 오류: ${paymentResponse.status} - ${errorText}`);
      }

      payment = await paymentResponse.json();
      console.log('포트원 결제 정보:', payment);
    } catch (portoneError) {
      console.error('포트원 API 호출 실패:', portoneError);
      return Response.json({
        error: `포트원 API 호출 실패: ${portoneError.message}`
      }, { status: 500 });
    }

    // 2. 고객사 내부 주문 데이터의 가격과 실제 지불된 금액을 비교합니다.
    console.log('2. 결제 금액 검증:', {
      orderAmount: order.amount,
      paymentAmount: payment.amount?.total
    });

    if (order.amount !== payment.amount?.total) {
      console.error("결제 금액이 불일치합니다.", {
        expected: order.amount,
        actual: payment.amount?.total
      });
      return Response.json({ error: "결제 금액이 불일치합니다." }, { status: 400 });
    }

    console.log('3. 결제 상태 처리:', payment.status);

    // 3. 결제 상태에 따른 처리
    switch (payment.status) {
      case "VIRTUAL_ACCOUNT_ISSUED": {
        console.log('가상계좌 발급 처리 시작');
        try {
          // 결제 정보 저장
          const { data: paymentData, error: paymentError } = await supabase
            .from('payments')
            .insert([
              {
                reservation_id: reservationId,
                amount: payment.amount.total,
                currency: 'KRW',
                payment_method: 'virtual_account',
                payment_provider: 'portone',
                transaction_id: paymentId,
                status: 'pending'
              }
            ])
            .select()
            .single();

          if (paymentError) {
            console.error('가상계좌 결제 정보 저장 실패:', paymentError);
            throw paymentError;
          }

          console.log('가상계좌 결제 정보 저장 성공:', paymentData);
          return Response.json({
            success: true,
            status: 'virtual_account_issued',
            payment: paymentData
          });
        } catch (vaError) {
          console.error('가상계좌 처리 중 오류:', vaError);
          return Response.json({
            error: `가상계좌 처리 실패: ${vaError.message}`
          }, { status: 500 });
        }
      }

      case "PAID": {
        console.log('결제 완료 처리 시작');

        try {
          // 4. 결제 확정 처리: 예약 상태를 confirmed로 변경
          console.log('4-1. 예약 상태 업데이트 시작');
          const { data: reservation, error: reservationError } = await supabase
            .from('reservations')
            .update({
              status: 'confirmed',
              updated_at: new Date().toISOString()
            })
            .eq('id', reservationId)
            .select(`
              *,
              product:products(*)
            `)
            .single();

          if (reservationError) {
            console.error('예약 상태 업데이트 실패:', reservationError);
            throw reservationError;
          }
          console.log('예약 상태 업데이트 성공:', reservation);

          // 4-1-1. 사용자 정보 별도 조회 (auth.users에서)
          console.log('4-1-1. 사용자 정보 조회 시작');
          let userInfo = null;
          try {
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(reservation.user_id);
            if (!userError && userData?.user) {
              userInfo = userData.user;
              console.log('사용자 정보 조회 성공:', userInfo.email);
            } else {
              console.warn('사용자 정보 조회 실패:', userError?.message);
            }
          } catch (userFetchError) {
            console.warn('사용자 정보 조회 중 오류:', userFetchError.message);
          }

          // 5. 결제 정보 저장
          console.log('4-2. 결제 정보 저장 시작');
          const { data: paymentData, error: paymentError } = await supabase
            .from('payments')
            .insert([
              {
                reservation_id: reservationId,
                amount: payment.amount.total,
                currency: 'KRW',
                payment_method: payment.paymentMethod?.type || 'card',
                payment_provider: 'portone',
                transaction_id: paymentId,
                status: 'completed',
                paid_at: payment.paidAt || new Date().toISOString()
              }
            ])
            .select()
            .single();

          if (paymentError) {
            console.error('결제 정보 저장 실패:', paymentError);
            throw paymentError;
          }
          console.log('결제 정보 저장 성공:', paymentData);

          // 6. 관리자에게 결제 완료 알림 생성
          console.log('4-3. 관리자 알림 생성 시작');
          try {
            const notificationData = {
              id: reservation.id,
              productId: reservation.product_id,
              productName: reservation.product?.title || '상품명 없음',
              customerName: userInfo?.user_metadata?.name ||
                userInfo?.user_metadata?.full_name ||
                userInfo?.email ||
                '고객명 없음',
              customerEmail: userInfo?.email || '',
              totalAmount: payment.amount.total,
              reservationDate: reservation.reservation_date,
              participants: reservation.participants
            };

            const notificationResult = await createPaymentCompletedNotification(notificationData);

            if (notificationResult.success) {
              console.log('관리자 알림 생성 성공:', notificationResult.notifications?.length, '개의 알림 생성');
            } else {
              console.warn('관리자 알림 생성 실패:', notificationResult.error);
              // 알림 실패는 치명적이지 않으므로 결제 프로세스는 계속 진행
            }
          } catch (notificationError) {
            console.warn('관리자 알림 생성 중 오류 (계속 진행):', notificationError.message);
          }

          // 7. 성공 응답
          console.log('=== 결제 완료 처리 성공 ===');
          return Response.json({
            success: true,
            reservation: {
              ...reservation,
              user: userInfo // 사용자 정보 추가
            },
            payment: paymentData,
            message: '예약이 확정되었습니다.'
          });

        } catch (paidError) {
          console.error('결제 완료 처리 중 오류:', paidError);
          return Response.json({
            error: `결제 완료 처리 실패: ${paidError.message}`
          }, { status: 500 });
        }
      }

      default: {
        console.error('처리할 수 없는 결제 상태:', payment.status);
        return Response.json({
          error: `처리할 수 없는 결제 상태입니다: ${payment.status}`
        }, { status: 400 });
      }
    }

  } catch (error) {
    console.error('=== 결제 완료 처리 중 전체 오류 ===');
    console.error('오류 타입:', error.constructor.name);
    console.error('오류 메시지:', error.message);
    console.error('오류 스택:', error.stack);
    console.error('오류 객체:', error);

    return Response.json({
      error: error.message || '결제 처리 중 오류가 발생했습니다.',
      errorType: error.constructor.name
    }, { status: 500 });
  }
}
