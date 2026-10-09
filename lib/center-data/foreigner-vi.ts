import type { Center } from "@/lib/centers"

/**
 * Foreigner Center (vi, /vi/foreigner). lib/center-data/foreigner.ts 를 옮긴 것 (상담 언어 안내는 넣지 않음)
 * 법률 내용(조문·기간·요건)은 게시 전 담당 변호사 검수가 필요합니다.
 */
export const foreignerVi: Center = {
  "slug": "foreigner-vi",
  "lang": "vi",
  "basePath": "/vi/foreigner",
  "alternates": {
    "ko": "/foreigner",
    "en": "/en/foreigner",
    "zh": "/zh/foreigner",
    "vi": "/vi/foreigner",
    "ru": "/ru/foreigner",
    "mn": "/mn/foreigner"
  },
  "name": "Trung tâm Người nước ngoài",
  "summary": "Bị từ chối gia hạn lưu trú hoặc thay đổi tư cách lưu trú; lệnh xuất cảnh, lệnh trục xuất, lệnh tạm giữ; thẩm tra vi phạm xuất nhập cảnh; vụ án hình sự liên quan đến người nước ngoài; nợ lương và chuyển nơi làm việc; ly hôn có yếu tố nước ngoài; tranh chấp tiền đặt cọc và bị lừa đảo",
  "tone": "warm",
  "seo": {
    "title": "Luật sư Hàn Quốc cho người nước ngoài | Từ chối gia hạn visa, trục xuất, vụ án hình sự | Jisan Law",
    "description": "Bị từ chối gia hạn lưu trú hoặc thay đổi tư cách lưu trú, bị hủy giấy phép lưu trú, nhận lệnh xuất cảnh hay lệnh trục xuất, bị tạm giữ tại trung tâm tạm giữ người nước ngoài, bị cảnh sát triệu tập, bị nợ lương, chuyển nơi làm việc, ly hôn có yếu tố nước ngoài. Chúng tôi tính thời hạn trước tiên và tranh chấp bằng khiếu nại hành chính, kiện hành chính. Hãy nhắn tin cho chúng tôi qua khung chat trên trang này.",
    "keywords": [
      "luật sư Hàn Quốc",
      "luật sư visa Hàn Quốc",
      "bị từ chối gia hạn visa Hàn Quốc",
      "trục xuất Hàn Quốc",
      "lệnh xuất cảnh Hàn Quốc kiện hành chính",
      "trung tâm tạm giữ người nước ngoài Hàn Quốc",
      "người nước ngoài bị điều tra hình sự Hàn Quốc",
      "lao động nước ngoài bị nợ lương Hàn Quốc"
    ]
  },
  "hero": {
    "title": "Gặp vấn đề pháp lý tại Hàn Quốc?\nChúng tôi xem xét cả vụ việc lẫn chuyện lưu trú của bạn",
    "sub": "Bị từ chối gia hạn lưu trú, nhận lệnh xuất cảnh hoặc lệnh trục xuất, bị cảnh sát điều tra, bị nợ lương, ly hôn hay mất tiền đặt cọc. Chúng tôi cùng bạn xem xét một vụ việc sẽ ảnh hưởng thế nào đến việc lưu trú."
  },
  "stageTitle": "Bạn đang ở trong tình huống nào?",
  "stages": [
    {
      "label": "Tôi bị từ chối gia hạn lưu trú hoặc thay đổi tư cách lưu trú",
      "hint": "Trước hết hãy kiểm tra thời hạn xuất cảnh trên thông báo →",
      "href": "#process"
    },
    {
      "label": "Tôi nhận lệnh xuất cảnh hoặc lệnh trục xuất",
      "hint": "Thời hạn phản đối rất ngắn. Nhắn tin ngay →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "Người nhà tôi bị đưa vào trung tâm tạm giữ người nước ngoài",
      "hint": "Nhắn tin ngay →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "Tôi bị cảnh sát gọi đến làm việc",
      "hint": "Yêu cầu phiên dịch và chuẩn bị cho buổi lấy lời khai →",
      "href": "#process"
    },
    {
      "label": "Người nhà tôi là người nước ngoài và bị bắt",
      "hint": "Nhắn tin ngay →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "Tôi không được trả lương hoặc trợ cấp thôi việc",
      "hint": "Bạn có thể đòi bất kể tình trạng lưu trú →",
      "href": "#process"
    }
  ],
  "intro": {
    "title": "Vụ án hình sự và chuyện lưu trú phải được xem xét cùng nhau",
    "body": [
      "Với người nước ngoài sống tại Hàn Quốc, một vấn đề pháp lý thường không dừng lại ở chính nó. Một lần bị phạt tiền có thể bị xét đến khi thẩm tra gia hạn lưu trú. Ngay khi nghỉ việc, bạn phải tính thời gian lưu trú còn lại. Khi đang kiện ly hôn, điều lo lắng đầu tiên là tư cách lưu trú sẽ ra sao. Trung tâm Người nước ngoài của Jisan Law không tách rời vụ việc và việc lưu trú, mà tư vấn cả hai cùng lúc.",
      "Vụ án hình sự đặc biệt như vậy. Người bị tuyên hình phạt tù (금고) trở lên rồi được thả có thể thuộc diện bị trục xuất. Ngay cả hình phạt tiền, nếu mức độ vi phạm nghiêm trọng, cũng có thể là lý do hủy giấy phép lưu trú (Điều 46, Điều 89 Luật Quản lý Xuất nhập cảnh (출입국관리법)). Vụ việc kết thúc bằng tạm hoãn truy tố (기소유예) hay không chuyển hồ sơ sang viện kiểm sát (불송치) vẫn để lại hồ sơ lý lịch điều tra (수사경력자료), và hồ sơ này có thể bị tra cứu khi cần cho việc xét cấp phép lưu trú hoặc nhập quốc tịch của người nước ngoài (Điều 6 Luật về việc mất hiệu lực của hình phạt (형의 실효 등에 관한 법률)). Vì vậy, ngay từ giai đoạn điều tra phải cân nhắc kết quả xử lý có ý nghĩa gì đối với việc lưu trú.",
      "Vụ việc của người nước ngoài còn có thời hạn rất ngắn. Khi bị từ chối gia hạn lưu trú, theo nguyên tắc, thông báo sẽ ghi thời hạn xuất cảnh trong vòng 14 ngày kể từ ngày cấp. Đơn phản đối lệnh trục xuất phải nộp trong vòng 7 ngày kể từ ngày nhận lệnh. Dù đã nộp khiếu nại hành chính hay khởi kiện hành chính, quyết định vẫn giữ nguyên hiệu lực, nên nếu đang có thời hạn xuất cảnh thì phải xin tạm đình chỉ thi hành cùng lúc.",
      "Chúng tôi không chủ yếu làm hộ hồ sơ đơn giản, mà nhận các vụ việc có tranh chấp như bị từ chối, bị hủy, bị trục xuất: phản đối, khiếu nại hành chính, kiện hành chính, cùng các vụ việc hình sự, lao động, gia đình gắn liền với chúng. Bạn có thể nhắn tin cho chúng tôi qua khung chat trên trang này bất cứ lúc nào, kể cả cuối tuần và ngày lễ."
    ]
  },
  "situations": {
    "title": "Những trường hợp thường tìm đến chúng tôi",
    "items": [
      "Tôi nộp đơn gia hạn lưu trú nhưng nhận thông báo từ chối kèm thời hạn xuất cảnh",
      "Sau khi bị phạt tiền vì lái xe khi say rượu, cơ quan xuất nhập cảnh gọi tôi đến làm việc",
      "Chồng tôi bị bắt trong đợt kiểm tra và đang ở trung tâm tạm giữ người nước ngoài, tôi không biết làm sao để đưa anh ấy ra",
      "Tôi bị gọi đến cảnh sát để lấy lời khai nhưng tiếng Hàn chưa tốt, không biết có được yêu cầu phiên dịch không",
      "Công ty đã ba tháng không trả lương, tôi lo nếu tố giác thì việc lưu trú sẽ gặp rắc rối",
      "Tôi làm việc theo chế độ cấp phép tuyển dụng (고용허가제) nhưng chủ không đồng ý cho chuyển nơi làm việc",
      "Tôi muốn ly hôn với vợ/chồng người Hàn và muốn biết ly hôn xong có phải xuất cảnh ngay không",
      "Hợp đồng thuê nhà đã hết nhưng chủ nhà không trả tiền đặt cọc và tránh liên lạc"
    ]
  },
  "areasTitle": "Lĩnh vực của Trung tâm Người nước ngoài",
  "areas": [
    {
      "name": "Từ chối gia hạn lưu trú, thay đổi tư cách lưu trú",
      "law": "Điều 24, Điều 25 Luật Quản lý Xuất nhập cảnh; Điều 33 Nghị định thi hành; Điều 20 Luật Tố tụng hành chính",
      "desc": "Khi bị từ chối gia hạn lưu trú hoặc thay đổi tư cách lưu trú, thông báo sẽ ghi thời hạn xuất cảnh. Chúng tôi xác định lý do từ chối, quyết định nên nộp đơn lại hay tranh chấp bằng khiếu nại hành chính hoặc kiện hành chính, và nếu đang có thời hạn xuất cảnh thì xin tạm đình chỉ thi hành cùng lúc."
    },
    {
      "name": "Hủy giấy phép lưu trú, tư cách thường trú",
      "law": "Điều 89, Điều 89-2 Luật Quản lý Xuất nhập cảnh",
      "desc": "Giấy phép lưu trú hoặc tư cách thường trú có thể bị hủy vì giấy tờ giả, vi phạm điều kiện cấp phép, vi phạm pháp luật. Khi được mời đến trình bày ý kiến, chúng tôi chuẩn bị tài liệu từ lúc đó. Nếu quyết định hủy được ban hành, chúng tôi tranh chấp bằng khiếu nại hành chính và kiện hành chính."
    },
    {
      "name": "Lệnh xuất cảnh, lệnh trục xuất, lệnh tạm giữ",
      "law": "Điều 46, Điều 51, Điều 55, Điều 60, Điều 63, Điều 65, Điều 68 Luật Quản lý Xuất nhập cảnh",
      "desc": "Lệnh xuất cảnh (출국명령서), lệnh trục xuất (강제퇴거명령서) và lệnh tạm giữ (보호명령서) có cách tranh chấp và thời hạn khác nhau. Với lệnh trục xuất, bạn có thể nộp đơn phản đối trong vòng 7 ngày kể từ ngày nhận lệnh. Với việc tạm giữ tại trung tâm tạm giữ người nước ngoài, bạn có thể yêu cầu Ủy ban Tạm giữ Người nước ngoài (외국인보호위원회) xem xét và xin tạm thời giải trừ tạm giữ. Chúng tôi cũng nhận kiện yêu cầu hủy quyết định và xin tạm đình chỉ thi hành."
    },
    {
      "name": "Cấm nhập cảnh, từ chối cấp thị thực",
      "law": "Điều 7, Điều 8, Điều 11 Luật Quản lý Xuất nhập cảnh",
      "desc": "Chúng tôi xác định lý do khi người nhà ở nước ngoài bị từ chối cấp thị thực (사증) hoặc bị chặn nhập cảnh tại sân bay. Có án lệ cho rằng bản thân người nước ngoài khó kiện việc từ chối cấp thị thực, nên chúng tôi cùng xem xét những thủ tục mà người nhà tại Hàn Quốc có thể làm và tài liệu cần bổ sung khi nộp đơn lại."
    },
    {
      "name": "Thẩm tra vi phạm xuất nhập cảnh, tuyển dụng trái phép",
      "law": "Điều 48, Điều 94, Điều 95, Điều 101, Điều 102, Điều 105 Luật Quản lý Xuất nhập cảnh",
      "desc": "Chúng tôi hỗ trợ người nước ngoài bị cơ quan xuất nhập cảnh điều tra, thẩm tra vì lưu trú quá hạn, làm việc hoặc đổi nơi làm việc khi chưa được phép, và công ty bị điều tra vì tuyển người nước ngoài không được phép làm việc. Chúng tôi chuẩn bị cho buổi lấy lời khai, xử lý thủ tục từ quyết định thông báo nộp tiền phạt vi phạm (범칙금 통고처분) dẫn đến lệnh xuất cảnh hoặc bị chuyển hồ sơ truy cứu, cho đến việc bị hạn chế tuyển dụng."
    },
    {
      "name": "Bị từ chối nhập quốc tịch, thường trú (F-5)",
      "law": "Điều 5, Điều 6 Luật Quốc tịch; Phụ lục 1-3 Nghị định thi hành Luật Quản lý Xuất nhập cảnh",
      "desc": "Khi đơn xin nhập quốc tịch hoặc tư cách thường trú bị từ chối vì các điều kiện như phẩm hạnh tốt hay khả năng tự bảo đảm sinh kế, chúng tôi xác định cụ thể lý do từ chối. Chúng tôi thu thập tài liệu giải thích những tình tiết bị coi là vấn đề, như tiền án phạt tiền, và cân nhắc nộp đơn lại hay kiện hành chính sẽ có lợi hơn."
    },
    {
      "name": "Lưu trú diện kết hôn (F-6)",
      "law": "Điều 25, Điều 25-2 Luật Quản lý Xuất nhập cảnh; Phụ lục 1-2 Nghị định thi hành",
      "desc": "Khi bạn sống ly thân hoặc đang kiện ly hôn với vợ/chồng người Hàn, hoặc khi vợ/chồng không hợp tác cung cấp giấy tờ gia hạn, chúng tôi xác định cách để tiếp tục lưu trú. Chúng tôi chứng minh trong cả thủ tục ly hôn lẫn thẩm tra lưu trú rằng trách nhiệm chính khiến hôn nhân tan vỡ thuộc về người vợ/chồng Hàn Quốc."
    },
    {
      "name": "Người nước ngoài bị điều tra, bị bắt",
      "law": "Điều 180, Điều 243-2 Luật Tố tụng hình sự; Điều 91 Quy tắc điều tra của cảnh sát",
      "desc": "Người nước ngoài có thể được phiên dịch sang ngôn ngữ mình hiểu khi bị lấy lời khai, và khi bị bắt có thể yêu cầu thông báo cho cơ quan lãnh sự. Chúng tôi luyện tập trước buổi lấy lời khai, đi cùng khi lấy lời khai, gặp người bị bắt, tham dự phiên thẩm tra lệnh bắt giam (영장실질심사), và cùng kiểm tra biên bản đã được phiên dịch có đúng với lời khai hay không."
    },
    {
      "name": "Hình phạt và ảnh hưởng đến lưu trú",
      "law": "Điều 46 khoản 1 điểm 13, Điều 89, Điều 89-2 Luật Quản lý Xuất nhập cảnh",
      "desc": "Những vụ việc người nước ngoài hay vướng vào như lái xe khi say rượu, hành hung, ma túy, cho mượn tài khoản ngân hàng cho đường dây lừa đảo qua điện thoại sẽ dẫn đến cả hình phạt lẫn thẩm tra lưu trú. Việc giảm mức xử lý xuống tạm hoãn truy tố hay phạt tiền ảnh hưởng trực tiếp đến việc lưu trú, nên chúng tôi chuẩn bị cho cả hai vấn đề ngay từ giai đoạn điều tra."
    },
    {
      "name": "Người nước ngoài là nạn nhân tố cáo",
      "law": "Điều 223 Luật Tố tụng hình sự; Điều 92-2 Nghị định thi hành Luật Quản lý Xuất nhập cảnh",
      "desc": "Nhiều người bị hành hung, bị xâm hại tình dục, bị lừa đảo nhưng vẫn ngần ngại trình báo vì lo chuyện lưu trú. Có quy định cho phép miễn nghĩa vụ thông báo cho cơ quan xuất nhập cảnh của công chức khi việc cứu giúp nạn nhân được ưu tiên, như khi điều tra tội phạm. Chúng tôi hỗ trợ từ việc soạn đơn tố cáo (고소장), đi cùng khi khai báo, đến thỏa thuận và lệnh bồi thường (배상명령)."
    },
    {
      "name": "Nợ lương, trợ cấp thôi việc, tai nạn lao động",
      "law": "Điều 36, Điều 107 Luật Tiêu chuẩn Lao động; Điều 9 Luật Bảo đảm Trợ cấp Hưu trí cho Người lao động; Điều 6 Luật Bảo hiểm Bồi thường Tai nạn Lao động",
      "desc": "Lao động nước ngoài, bất kể tư cách lưu trú, cũng được nhận tiền công cho phần việc đã làm, trợ cấp thôi việc và quyền lợi bảo hiểm tai nạn lao động. Chúng tôi nộp đơn trình báo lên Sở Lao động (노동청), khởi kiện dân sự và xin kê biên tạm thời, nộp hồ sơ tai nạn lao động. Nếu ngày xuất cảnh đã gần, chúng tôi sắp xếp thứ tự công việc theo ngày đó."
    },
    {
      "name": "Chuyển nơi làm việc, sa thải theo chế độ cấp phép tuyển dụng (E-9)",
      "law": "Điều 25 Luật về Tuyển dụng Lao động Nước ngoài; Điều 23, Điều 28 Luật Tiêu chuẩn Lao động",
      "desc": "Nếu khó tiếp tục làm việc vì bị nợ lương hay bị đối xử bất công, có những trường hợp bạn có thể xin chuyển nơi làm việc (사업장 변경) mà không cần chủ sử dụng đồng ý. Chúng tôi kiểm tra thời hạn nộp đơn và số lần đã chuyển; nếu bị sa thải trái pháp luật, chúng tôi xem xét cả việc yêu cầu Ủy ban Lao động (노동위원회) khắc phục."
    },
    {
      "name": "Ly hôn có yếu tố nước ngoài, nuôi con, thừa kế",
      "law": "Điều 56, Điều 59, Điều 66, Điều 76, Điều 77 Luật Tư pháp quốc tế",
      "desc": "Nếu vợ chồng khác quốc tịch, trước hết phải xác định ly hôn tại tòa án nước nào và theo luật nước nào. Chúng tôi kiểm tra thẩm quyền của tòa án Hàn Quốc và luật áp dụng, rồi giải quyết việc ly hôn, quyền nuôi con và tiền cấp dưỡng nuôi con, cùng việc thừa kế tài sản còn lại ở Hàn Quốc."
    },
    {
      "name": "Tiền đặt cọc, hợp đồng, bị lừa đảo",
      "law": "Điều 3, Điều 3-3 Luật Bảo vệ Hợp đồng Thuê nhà ở; Điều 88-2 Luật Quản lý Xuất nhập cảnh",
      "desc": "Người nước ngoài sau khi đăng ký người nước ngoài (외국인등록) và khai báo thay đổi nơi cư trú (체류지 변경신고) sẽ được coi như đã đăng ký chuyển đến (전입신고), nên tiền đặt cọc cũng được bảo vệ. Chúng tôi tiến hành thủ tục đòi lại tiền đặt cọc, lệnh đăng ký quyền thuê nhà (임차권등기명령), tranh chấp hợp đồng, và các thủ tục dân sự, hình sự khi bị lừa đảo."
    }
  ],
  "table": {
    "title": "Cách tranh chấp và thời hạn theo từng loại quyết định về lưu trú",
    "nav": "Thời hạn theo quyết định",
    "columns": [
      "Quyết định, tình huống",
      "Cách tranh chấp",
      "Thời hạn",
      "Căn cứ"
    ],
    "rows": [
      [
        "Từ chối gia hạn lưu trú, thay đổi tư cách lưu trú",
        "Nộp đơn lại, khiếu nại hành chính (행정심판) hoặc kiện hành chính (행정소송) (nếu cần thì xin tạm đình chỉ thi hành (집행정지))",
        "90 ngày kể từ ngày biết có quyết định. Thời hạn xuất cảnh trên thông báo được định trong vòng 14 ngày kể từ ngày cấp",
        "Điều 33 Nghị định thi hành Luật Quản lý Xuất nhập cảnh; Điều 27 Luật Khiếu nại hành chính; Điều 20 Luật Tố tụng hành chính"
      ],
      [
        "Hủy, thay đổi giấy phép lưu trú",
        "Đến trình bày ý kiến; sau khi có quyết định thì khiếu nại hành chính, kiện hành chính",
        "Thông báo triệu tập phải được gửi chậm nhất 7 ngày trước ngày đến. Sau khi có quyết định: 90 ngày kể từ ngày biết",
        "Điều 89 Luật Quản lý Xuất nhập cảnh"
      ],
      [
        "Hủy tư cách thường trú (F-5)",
        "Trình bày ý kiến, xin cấp tư cách lưu trú thông thường, khiếu nại hành chính, kiện hành chính",
        "90 ngày kể từ ngày biết có quyết định",
        "Điều 89-2 Luật Quản lý Xuất nhập cảnh"
      ],
      [
        "Lệnh xuất cảnh (출국명령)",
        "Khiếu nại hành chính hoặc kiện hành chính, kèm tạm đình chỉ thi hành",
        "Thời hạn xuất cảnh được định trong vòng 30 ngày kể từ ngày ban hành. Khởi kiện: 90 ngày kể từ ngày biết",
        "Điều 68 Luật Quản lý Xuất nhập cảnh; Điều 65 Quy tắc thi hành"
      ],
      [
        "Lệnh trục xuất (강제퇴거명령)",
        "Nộp đơn phản đối (이의신청) lên Bộ trưởng Bộ Tư pháp; kiện hành chính, kèm tạm đình chỉ thi hành",
        "Đơn phản đối: 7 ngày kể từ ngày nhận lệnh. Khởi kiện: 90 ngày kể từ ngày biết",
        "Điều 60 Luật Quản lý Xuất nhập cảnh; Điều 20 Luật Tố tụng hành chính"
      ],
      [
        "Bị tạm giữ tại trung tâm tạm giữ người nước ngoài (외국인보호소)",
        "Yêu cầu Ủy ban Tạm giữ Người nước ngoài xem xét, xin tạm thời giải trừ tạm giữ (보호 일시해제)",
        "Ủy ban quyết định trong vòng 3 tuần kể từ ngày nhận hồ sơ (có thể gia hạn một lần thêm 2 tuần)",
        "Điều 55, Điều 65 Luật Quản lý Xuất nhập cảnh; Điều 70, Điều 79-2 Nghị định thi hành"
      ],
      [
        "Thẩm tra vi phạm xuất nhập cảnh (quyết định thông báo nộp tiền phạt vi phạm)",
        "Nộp tiền phạt vi phạm hoặc tranh chấp hành vi vi phạm; sau đó nếu có lệnh xuất cảnh, lệnh trục xuất thì phản đối theo thủ tục riêng của từng loại",
        "Nếu không nộp trong vòng 15 ngày kể từ ngày nhận thông báo thì sẽ bị chuyển hồ sơ truy cứu (고발)",
        "Điều 102, Điều 105, Điều 68 khoản 1 điểm 5 Luật Quản lý Xuất nhập cảnh"
      ],
      [
        "Cấm xuất cảnh tạm thời (출국정지) khi đang bị điều tra, xét xử",
        "Nộp đơn phản đối lên Bộ trưởng Bộ Tư pháp",
        "10 ngày kể từ ngày nhận thông báo hoặc ngày biết",
        "Điều 29, Điều 4-5 Luật Quản lý Xuất nhập cảnh"
      ],
      [
        "Từ chối nhập quốc tịch",
        "Nộp đơn lại hoặc kiện hành chính",
        "90 ngày kể từ ngày biết có quyết định",
        "Điều 4 Luật Quốc tịch; Điều 20 Luật Tố tụng hành chính"
      ]
    ],
    "note": "Theo pháp luật hiện hành tại thời điểm tháng 10 năm 2026. Khiếu nại hành chính và kiện hành chính không thể nộp khi đã quá 180 ngày và 1 năm tương ứng kể từ ngày có quyết định, trừ khi có lý do chính đáng. Dù đã nộp khiếu nại hay khởi kiện, quyết định vẫn giữ nguyên hiệu lực, nên nếu có thời hạn xuất cảnh thì phải xin tạm đình chỉ thi hành cùng lúc (Điều 30 Luật Khiếu nại hành chính, Điều 23 Luật Tố tụng hành chính)."
  },
  "points": {
    "title": "Bốn điều chúng tôi kiểm tra trước tiên trong vụ việc của người nước ngoài",
    "items": [
      {
        "title": "Xem các ngày ghi trên giấy tờ trước",
        "desc": "Chúng tôi kiểm tra trước thời hạn xuất cảnh trên thông báo từ chối, ngày nhận lệnh trục xuất và ngày hết hạn lưu trú hiện tại. Chính những ngày này quyết định bạn còn dùng được thủ tục nào."
      },
      {
        "title": "Kết quả hình sự dẫn đến thẩm tra lưu trú",
        "desc": "Người bị tuyên hình phạt tù (금고) trở lên rồi được thả có thể thuộc diện bị trục xuất. Hình phạt tiền cũng bị coi là tình tiết bất lợi khi thẩm tra gia hạn, thay đổi tư cách, thường trú, nhập quốc tịch. Dù kết thúc bằng tạm hoãn truy tố hay không chuyển hồ sơ sang viện kiểm sát, hồ sơ lý lịch điều tra vẫn còn. Giảm mức xử lý ngay từ giai đoạn điều tra cũng chính là giữ được việc lưu trú."
      },
      {
        "title": "Không ký vào giấy tờ mình chưa hiểu",
        "desc": "Biên bản lời khai và giấy tờ xuất nhập cảnh được lập bằng tiếng Hàn. Bạn có thể yêu cầu đọc lại nội dung qua phiên dịch, và phải yêu cầu sửa những chỗ ghi khác với lời mình nói trước khi ký."
      },
      {
        "title": "Quyết định vẫn giữ nguyên trong khi tranh chấp",
        "desc": "Nộp khiếu nại hành chính hay khởi kiện không làm thời hạn xuất cảnh dừng lại. Phải xin tạm đình chỉ thi hành trước khi hết hạn và được chấp nhận thì mới có thể ở lại Hàn Quốc để tranh chấp."
      }
    ]
  },
  "processes": [
    {
      "title": "Người nước ngoài bị điều tra trong vụ án hình sự",
      "steps": [
        {
          "title": "Tư vấn và kiểm tra tình trạng lưu trú",
          "desc": "Luật sư điều hành trực tiếp nghe nội dung cáo buộc và yêu cầu triệu tập, đồng thời kiểm tra tư cách lưu trú và ngày hết hạn qua hộ chiếu và thẻ đăng ký người nước ngoài."
        },
        {
          "title": "Yêu cầu phiên dịch và luyện tập trước buổi lấy lời khai",
          "desc": "Chúng tôi báo trước cho điều tra viên ngôn ngữ cần phiên dịch và luyện tập với các câu hỏi dự kiến. Chúng tôi nhắc bạn không lấp chỗ mình không nhớ bằng phỏng đoán."
        },
        {
          "title": "Đi cùng khi lấy lời khai",
          "desc": "Chúng tôi vào phòng lấy lời khai cùng bạn, theo dõi xem câu hỏi và câu trả lời qua phiên dịch có khớp nhau không, và nêu ý kiến ngay tại chỗ với câu hỏi mang tính dẫn dắt hoặc không đúng. Trước khi ký, chúng tôi kiểm tra lại biên bản qua phiên dịch."
        },
        {
          "title": "Bản ý kiến và ứng phó với quyết định xử lý",
          "desc": "Với vụ việc tranh chấp cáo buộc, chúng tôi nộp bản ý kiến sắp xếp chứng cứ. Với vụ việc thừa nhận, chúng tôi nộp cho cảnh sát và công tố viên tài liệu về việc khắc phục thiệt hại và cuộc sống ổn định tại Hàn Quốc. Chúng tôi cũng giải thích mức xử lý ảnh hưởng thế nào đến việc lưu trú."
        },
        {
          "title": "Nối tiếp sang thủ tục lưu trú",
          "desc": "Khi có quyết định xử lý hoặc bản án, chúng tôi chuẩn bị cho việc cơ quan xuất nhập cảnh triệu tập, thẩm tra gia hạn, thủ tục trục xuất. Nếu cần, chúng tôi tiếp tục nhận cả đơn phản đối và kiện hành chính."
        }
      ]
    },
    {
      "title": "Khi nhận lệnh xuất cảnh hoặc lệnh trục xuất",
      "steps": [
        {
          "title": "Xác định loại quyết định và các mốc ngày",
          "desc": "Kiểm tra giấy tờ bạn nhận là giấy khuyến cáo xuất cảnh (출국권고서), lệnh xuất cảnh (출국명령서) hay lệnh trục xuất (강제퇴거명령서), và ghi lại ngày nhận cùng thời hạn xuất cảnh. Mỗi loại có thủ tục và thời hạn khác nhau."
        },
        {
          "title": "Nộp đơn phản đối",
          "desc": "Với lệnh trục xuất, đơn phản đối phải được nộp lên Bộ trưởng Bộ Tư pháp thông qua cơ quan xuất nhập cảnh trong vòng 7 ngày kể từ ngày nhận lệnh. Nếu có hoàn cảnh đặc biệt cần ở lại Hàn Quốc, chúng tôi đồng thời xin cấp phép lưu trú đặc biệt (체류허가 특례)."
        },
        {
          "title": "Ứng phó với việc tạm giữ",
          "desc": "Nếu bị đưa vào trung tâm tạm giữ người nước ngoài, chúng tôi yêu cầu Ủy ban Tạm giữ Người nước ngoài xem xét việc tạm giữ hoặc xin tạm thời giải trừ tạm giữ. Chúng tôi chuẩn bị tiền bảo lãnh, người bảo lãnh và giấy tờ về chỗ ở."
        },
        {
          "title": "Kiện hành chính và tạm đình chỉ thi hành",
          "desc": "Chúng tôi nộp đơn kiện yêu cầu hủy quyết định trong vòng 90 ngày kể từ ngày biết có quyết định, và nếu sắp bị xuất cảnh hoặc cưỡng chế về nước thì xin tạm đình chỉ thi hành cùng lúc. Chúng tôi chứng minh bằng tài liệu những thiệt hại khó khắc phục như gia đình, bệnh tật, vụ kiện đang diễn ra."
        },
        {
          "title": "Thu xếp theo kết quả",
          "desc": "Nếu quyết định vẫn được giữ nguyên, chúng tôi thu xếp các khoản tiền cần nhận, tài sản và vụ việc đang dở dang trước khi xuất cảnh, và kiểm tra trước những điểm có thể gây trở ngại khi nhập cảnh lại."
        }
      ]
    },
    {
      "title": "Khi bị từ chối gia hạn lưu trú hoặc thay đổi tư cách lưu trú",
      "steps": [
        {
          "title": "Kiểm tra thông báo từ chối",
          "desc": "Chúng tôi xác định lý do từ chối và thời hạn xuất cảnh. Theo nguyên tắc, thời hạn xuất cảnh được định trong vòng 14 ngày kể từ ngày cấp thông báo. Nếu bị từ chối thay đổi tư cách, chúng tôi xem bạn có thể ở lại trong thời gian còn lại của tư cách cũ hay không."
        },
        {
          "title": "Chọn cách tranh chấp",
          "desc": "Nếu bị từ chối vì thiếu giấy tờ, bổ sung rồi nộp lại có thể nhanh hơn. Nếu vấn đề là đánh giá theo quyền tùy nghi hoặc nhận định sai sự thật, chúng tôi chuẩn bị khiếu nại hành chính hoặc kiện hành chính."
        },
        {
          "title": "Xin tạm đình chỉ thi hành",
          "desc": "Trong thời hạn xuất cảnh, chúng tôi nộp khiếu nại hành chính hoặc khởi kiện và xin tạm đình chỉ thi hành cùng lúc. Chúng tôi tính ngược từ thời hạn để hạn không trôi qua trước khi có quyết định."
        },
        {
          "title": "Sắp xếp lập luận và tài liệu",
          "desc": "Chúng tôi sắp xếp cuộc sống trong thời gian lưu trú, quan hệ gia đình, hồ sơ công việc và nộp thuế, hoàn cảnh dẫn đến tiền án, để chứng minh quyết định là quá nặng."
        },
        {
          "title": "Sau quyết định khiếu nại hoặc bản án",
          "desc": "Nếu quyết định bị hủy, bạn được thẩm tra lại để được cấp phép lưu trú. Nếu bị bác, chúng tôi cùng bạn quyết định nên kháng cáo, nộp đơn lại hay chuẩn bị xuất cảnh."
        }
      ]
    }
  ],
  "lawyers": [
    {
      "slug": "kim-hansol",
      "note": "Nguyên công tố viên (Incheon, Ansan, Hongseong) · Tốt nghiệp Đại học Toronto, Canada"
    },
    {
      "slug": "kim-miso",
      "note": "Tốt nghiệp ngành Biên phiên dịch tiếng Anh, Đại học Ngoại ngữ Hankuk · Nguyên luật sư nội bộ của Wemade Co., Ltd."
    }
  ],
  "faqs": [
    {
      "q": "Tôi bị từ chối gia hạn lưu trú. Tôi có bắt buộc phải rời Hàn Quốc trước ngày ghi trên thông báo không?",
      "a": "Nếu không xuất cảnh trước thời hạn xuất cảnh ghi trên thông báo, bạn sẽ bị coi là lưu trú quá hạn và có thể bị trục xuất hoặc bị xử phạt. Muốn tranh chấp, bạn phải nộp khiếu nại hành chính hoặc kiện hành chính trước thời hạn, đồng thời xin tạm đình chỉ thi hành và được chấp nhận. Nếu có lý do bất khả kháng như bệnh tật hay không có phương tiện đi lại, bạn cũng có thể xin hoãn thời hạn xuất cảnh (Điều 33 Quy tắc thi hành Luật Quản lý Xuất nhập cảnh)."
    },
    {
      "q": "Chỉ bị phạt tiền thôi thì việc lưu trú có bị ảnh hưởng không?",
      "a": "Phạt tiền không thuộc “hình phạt tù (금고) trở lên”, là lý do trục xuất (Điều 46 khoản 1 điểm 13 Luật Quản lý Xuất nhập cảnh). Tuy nhiên, phạt tiền vẫn có thể bị xem là tình tiết bất lợi khi thẩm tra gia hạn lưu trú, thay đổi tư cách lưu trú, thường trú hay nhập quốc tịch. Nếu mức độ vi phạm nghiêm trọng, giấy phép lưu trú còn có thể bị hủy (Điều 89 khoản 1 điểm 5 Luật Quản lý Xuất nhập cảnh). Cùng một mức phạt tiền nhưng đánh giá có thể khác nhau tùy hoàn cảnh vụ việc và cuộc sống sau đó, nên cần cố gắng giảm mức xử lý ngay từ giai đoạn điều tra."
    },
    {
      "q": "Tôi đang cư trú bất hợp pháp. Tôi có thể trình báo việc bị nợ lương không?",
      "a": "Theo án lệ, người nước ngoài không có tư cách lao động nhưng thực tế đã làm việc vẫn có quyền nhận tiền lương, trợ cấp thôi việc và quyền lợi bảo hiểm tai nạn lao động. Khi thanh tra lao động điều tra việc nợ lương và xác định việc cứu giúp nạn nhân là ưu tiên, nghĩa vụ thông báo cho cơ quan xuất nhập cảnh có thể được miễn (Điều 92-2 Nghị định thi hành, Điều 70-2 Quy tắc thi hành Luật Quản lý Xuất nhập cảnh). Tuy nhiên, việc miễn tùy thuộc vào đánh giá của công chức phụ trách, nên hãy được tư vấn trước khi trình báo."
    },
    {
      "q": "Tôi có thể yêu cầu phiên dịch khi bị cảnh sát lấy lời khai không?",
      "a": "Có. Khi lấy lời khai người nước ngoài, cảnh sát phải phiên dịch sang ngôn ngữ mà người đó hiểu được (Điều 91 khoản 1 Quy tắc điều tra của cảnh sát). Dù bạn giao tiếp hằng ngày được, trong buổi lấy lời khai có nhiều thuật ngữ pháp lý, ý nghĩa có thể bị truyền đạt sai, nên yêu cầu phiên dịch sẽ an toàn hơn. Biên bản được lập bằng tiếng Hàn, vì vậy trước khi ký hãy yêu cầu đọc lại qua phiên dịch."
    },
    {
      "q": "Nếu nhận lệnh trục xuất, tôi sẽ không bao giờ được quay lại Hàn Quốc nữa sao?",
      "a": "Người đã xuất cảnh theo lệnh trục xuất mà chưa quá 5 năm có thể bị cấm nhập cảnh (Điều 11 khoản 1 điểm 6 Luật Quản lý Xuất nhập cảnh). Thời gian bị hạn chế nhập cảnh trên thực tế khác nhau tùy lý do. Nếu đã nhận lệnh, trước hết cần cùng xem xét có thể tranh chấp bằng đơn phản đối trong vòng 7 ngày và kiện hành chính hay không, hay tự nguyện xuất cảnh sẽ có lợi hơn."
    },
    {
      "q": "Nếu ly hôn với vợ/chồng người Hàn, tư cách lưu trú diện kết hôn có chấm dứt không?",
      "a": "Ngay cả khi vợ/chồng qua đời, mất tích hoặc không thể duy trì hôn nhân vì lý do không do lỗi của mình, bạn vẫn có thể được công nhận tư cách lưu trú diện kết hôn (F-6) (Phụ lục 1-2 Nghị định thi hành Luật Quản lý Xuất nhập cảnh). Tòa án Tối cao hiểu đây là trường hợp trách nhiệm chính khiến hôn nhân tan vỡ thuộc về người vợ/chồng Hàn Quốc (Bản án 2018두66869 của Tòa án Tối cao tuyên ngày 4/7/2019). Vì vậy, việc tranh chấp xem lỗi thuộc về ai trong vụ kiện ly hôn gắn trực tiếp với việc lưu trú."
    },
    {
      "q": "Chi phí được tính như thế nào?",
      "a": "Chi phí khác nhau tùy loại vụ việc, giai đoạn và số thủ tục cần làm, nên chúng tôi sẽ báo sau khi tư vấn. Khi nhiều thủ tục cùng lúc như đơn phản đối, kiện hành chính và vụ án hình sự, chúng tôi xác định trước thứ tự và phần việc bạn giao cho chúng tôi rồi mới giải thích chi phí."
    }
  ],
  "form": {
    "caseType": "Người nước ngoài",
    "stageOptions": [
      "Bị từ chối gia hạn lưu trú, thay đổi tư cách lưu trú; bị hủy giấy phép lưu trú; bị cấm nhập cảnh",
      "Lệnh xuất cảnh, lệnh trục xuất, lệnh tạm giữ",
      "Thẩm tra vi phạm xuất nhập cảnh; bị cảnh sát điều tra, bị bắt và các vụ án hình sự khác",
      "Nợ lương, chuyển nơi làm việc và các vấn đề lao động khác",
      "Ly hôn, tiền đặt cọc, bị lừa đảo và vấn đề khác"
    ]
  },
  "closing": "Nếu bạn đã nhận giấy tờ có ghi thời hạn xuất cảnh, hãy liên hệ với chúng tôi trước khi hết hạn."
}
