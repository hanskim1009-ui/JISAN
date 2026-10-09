import type { Center } from "@/lib/centers"

/**
 * crime center (vi, /vi/crime). scratchpad 번역 원문(형사센터 합본)을 옮긴 것
 * 법률 내용(조문·기간·요건)은 게시 전 담당 변호사 검수가 필요합니다.
 */
export const crimeVi: Center = {
  "slug": "crime-vi",
  "lang": "vi",
  "basePath": "/vi/crime",
  "alternates": {
    "ko": "/crime",
    "en": "/en/crime",
    "zh": "/zh/crime",
    "vi": "/vi/crime"
  },
  "name": "Trung tâm Hình sự",
  "summary": "Đi cùng khi cảnh sát lấy lời khai, bị bắt và tạm giam, lừa đảo và biển thủ, lái xe khi say rượu và hành hung, đại diện tố cáo",
  "tone": "dark",
  "seo": {
    "title": "Luật sư hình sự Hàn Quốc | Cảnh sát lấy lời khai, tạm giam, xét xử hình sự | Trung tâm Hình sự Jisan",
    "description": "Bị cảnh sát triệu tập, bị bắt hoặc tạm giam, bị đưa ra xét xử hình sự, hay muốn tố cáo. Tại Trung tâm Hình sự của Văn phòng Luật Jisan, luật sư điều hành trực tiếp tư vấn và đảm nhận việc luyện tập trước buổi lấy lời khai, đi cùng khi lấy lời khai và bản ý kiến của luật sư. Tư vấn qua điện thoại 24 giờ, kể cả cuối tuần và ngày lễ.",
    "keywords": [
      "luật sư hình sự Hàn Quốc",
      "luật sư khi bị cảnh sát lấy lời khai Hàn Quốc",
      "luật sư lệnh tạm giam Hàn Quốc",
      "luật sư vụ lừa đảo Hàn Quốc",
      "luật sư vụ biển thủ Hàn Quốc",
      "luật sư lái xe khi say rượu Hàn Quốc",
      "luật sư vụ hành hung Hàn Quốc",
      "đại diện tố cáo Hàn Quốc"
    ]
  },
  "hero": {
    "title": "Đừng một mình đối mặt với buổi lấy lời khai của cảnh sát\nJisan đồng hành cùng bạn từ đầu cuộc điều tra đến phiên tòa",
    "sub": "Chúng tôi không đứng sau thư ký văn phòng hay luật sư cộng sự. Luật sư điều hành trực tiếp tư vấn và đảm nhận việc luyện tập trước buổi lấy lời khai, đi cùng khi lấy lời khai và cả bản ý kiến của luật sư."
  },
  "stageTitle": "Bạn đang ở trong tình huống nào?",
  "stages": [
    {
      "label": "Tôi nhận được liên lạc yêu cầu đến đồn cảnh sát",
      "hint": "Chuẩn bị trước buổi lấy lời khai →",
      "href": "#process"
    },
    {
      "label": "Đã lấy lời khai xong và tôi đang chờ kết quả",
      "hint": "Nộp bản ý kiến →",
      "href": "#process"
    },
    {
      "label": "Người nhà tôi bị bắt",
      "hint": "Gọi ngay →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "Nhà hoặc công ty tôi bị khám xét, thu giữ",
      "hint": "Gọi ngay →",
      "href": "tel:02-6951-4097",
      "urgent": true
    },
    {
      "label": "Tôi đã nhận bản cáo trạng",
      "hint": "Chuẩn bị cho phiên tòa →",
      "href": "#consult"
    },
    {
      "label": "Tôi bị hại và muốn tố cáo",
      "hint": "Đại diện tố cáo →",
      "href": "#process"
    }
  ],
  "intro": {
    "title": "Vụ án hình sự khó nói ra, Jisan đứng về phía bạn",
    "body": [
      "Từ ngày nhận cuộc gọi của đồn cảnh sát, đầu óc bạn rối bời. Càng tìm trên mạng càng lo lắng, không biết phải làm gì trước mà ngày lấy lời khai cứ đến gần. Trung tâm Hình sự của Văn phòng Luật Jisan sắp xếp cho bạn những việc cần làm trước nhất vào lúc đó. Chúng tôi cùng bạn xem xét đó là cáo buộc gì, còn những tài liệu nào, phần nào cần tranh chấp và phần nào nên thừa nhận.",
      "Jisan không đứng sau thư ký văn phòng hay luật sư cộng sự. Buổi tư vấn đầu tiên do luật sư điều hành trực tiếp thực hiện. Khi nhận vụ việc, chúng tôi luyện tập với các câu hỏi dự kiến, vào phòng lấy lời khai cùng bạn và nộp bản ý kiến của luật sư (변호인 의견서) sau khi lấy lời khai xong. Luật sư phụ trách trực tiếp thực hiện toàn bộ quá trình này.",
      "Chúng tôi tư vấn tại văn phòng chính ở Seoul và các văn phòng chi nhánh ở Incheon, Hongseong, Songpa. Số 02-6951-4097 nhận cuộc gọi 24 giờ, kể cả cuối tuần và ngày lễ. Với những việc gấp như bị bắt, dù là ban đêm hay rạng sáng, hãy gọi cho chúng tôi."
    ]
  },
  "situations": {
    "title": "Những ai cần đến chúng tôi",
    "items": [
      "Tôi nhận cuộc gọi hoặc tin nhắn của đồn cảnh sát yêu cầu đến làm việc",
      "Sau một trận cãi nhau, tôi đẩy người kia và bị trình báo tội hành hung",
      "Tôi không trả được khoản tiền vay đúng hạn và bị tố cáo tội lừa đảo",
      "Tôi bị tố cáo tội biển thủ vì đã dùng tiền của công ty",
      "Tôi tưởng là việc làm thêm lương cao nhưng lại bị điều tra vì nghi liên quan đến lừa đảo qua điện thoại",
      "Tôi bị phát hiện lái xe khi say rượu và đã từng vi phạm trước đây",
      "Người nhà tôi bị bắt mà tôi không biết phải bắt đầu từ đâu",
      "Tôi bị quỵt tiền và đang phân vân có nên tố cáo không"
    ]
  },
  "areasTitle": "Mỗi vụ việc cần chuẩn bị khác nhau",
  "areas": [
    {
      "name": "Ứng phó khi bị bắt, tạm giam, khám xét thu giữ",
      "law": "Điều 200-2, Điều 201-2, Điều 215 Luật Tố tụng hình sự",
      "desc": "Khi bị bắt, việc có yêu cầu ra lệnh tạm giam hay không sẽ được quyết định trong vòng 48 giờ. Chúng tôi đến gặp ngay để nghe sự việc, chuẩn bị bản ý kiến nộp cho phiên thẩm tra lệnh bắt giam (영장실질심사) cùng tài liệu về nơi ở, công việc và quan hệ gia đình. Nếu bị khám xét, thu giữ (압수수색), chúng tôi kiểm tra việc thu giữ có vượt quá phạm vi ghi trong lệnh không, và xin tham gia quá trình giám định kỹ thuật số (포렌식) điện thoại, máy tính."
    },
    {
      "name": "Lừa đảo, biển thủ, bội tín",
      "law": "Điều 347, Điều 355, Điều 356 Bộ luật Hình sự; Điều 3 Luật về Tăng nặng Hình phạt đối với Tội phạm Kinh tế Đặc biệt",
      "desc": "Vấn đề thường bị tranh chấp là ngay từ đầu có ý định lừa dối hay không, hay chỉ là chuyện dân sự vì hoàn cảnh xấu đi nên không trả được. Chúng tôi sắp xếp hợp đồng, lịch sử chuyển tiền, tin nhắn theo thứ tự thời gian để ứng phó, và cũng nhận đại diện tố cáo cho phía bị hại."
    },
    {
      "name": "Lái xe khi say rượu, tai nạn giao thông",
      "law": "Điều 148-2 Luật Giao thông Đường bộ; Điều 3 Luật Đặc biệt về Xử lý Tai nạn Giao thông",
      "desc": "Khung hình phạt được quy định theo nồng độ cồn trong máu và tiền sử vi phạm. Trong phạm vi đó, chúng tôi kiểm tra quá trình đo nồng độ cồn, tìm và trình bày những tài liệu lượng hình thực sự được chấp nhận."
    },
    {
      "name": "Hành hung, gây thương tích, đe dọa",
      "law": "Điều 257, Điều 260, Điều 283 Bộ luật Hình sự",
      "desc": "Ngay từ đầu vụ việc, chúng tôi xác định đây có phải hành hung lẫn nhau không, có thể viện dẫn phòng vệ chính đáng không, và khi nào nên thỏa thuận. Hành hung thông thường và đe dọa là những tội không thể xử phạt nếu nạn nhân không muốn xử phạt."
    },
    {
      "name": "Xét xử hình sự",
      "law": "Điều 266-3, Điều 358 Luật Tố tụng hình sự",
      "desc": "Khi nhận bản cáo trạng, trước hết chúng tôi xem và sao chụp hồ sơ điều tra để xem xét. Phần cần tranh chấp thì tranh chấp bằng chứng cứ; vụ việc thừa nhận thì chuẩn bị việc khắc phục thiệt hại và tài liệu lượng hình. Kháng cáo bản án sơ thẩm phải làm trong vòng 7 ngày kể từ ngày tuyên án."
    },
    {
      "name": "Đại diện tố cáo",
      "law": "Điều 223, Điều 245-7 Luật Tố tụng hình sự",
      "desc": "Chúng tôi soạn đơn tố cáo sao cho cơ quan điều tra nhìn vào là hiểu ngay khi nào, ai, đã làm gì, và đi cùng bạn đến buổi lấy lời khai người tố cáo. Nếu cảnh sát quyết định không chuyển hồ sơ (불송치), chúng tôi nộp đơn phản đối để yêu cầu xem xét lại."
    }
  ],
  "table": {
    "title": "Mức xử phạt theo tội danh",
    "nav": "Mức xử phạt",
    "columns": [
      "Tội danh",
      "Điều luật căn cứ",
      "Khung hình phạt",
      "Ghi chú"
    ],
    "rows": [
      [
        "Lừa đảo",
        "Điều 347 Bộ luật Hình sự",
        "Tù đến 20 năm hoặc phạt tiền đến 50 triệu won (sửa đổi ngày 23/12/2025)",
        "Nếu số tiền thu lợi từ 500 triệu won trở lên thì áp dụng Luật Tội phạm Kinh tế Đặc biệt"
      ],
      [
        "Biển thủ, bội tín",
        "Điều 355 Bộ luật Hình sự",
        "Tù đến 5 năm hoặc phạt tiền đến 15 triệu won",
        ""
      ],
      [
        "Biển thủ, bội tín trong công việc",
        "Điều 356 Bộ luật Hình sự",
        "Tù đến 10 năm hoặc phạt tiền đến 30 triệu won",
        "Nếu số tiền thu lợi từ 500 triệu won trở lên thì áp dụng Luật Tội phạm Kinh tế Đặc biệt"
      ],
      [
        "Lừa đảo, biển thủ, bội tín (số tiền thu lợi từ 500 triệu won đến dưới 5 tỷ won)",
        "Điều 3 Luật Tội phạm Kinh tế Đặc biệt",
        "Tù có thời hạn từ 3 năm trở lên",
        "Từ 5 tỷ won trở lên: tù chung thân hoặc tù từ 5 năm trở lên"
      ],
      [
        "Hành hung",
        "Điều 260 Bộ luật Hình sự",
        "Tù đến 2 năm, phạt tiền đến 5 triệu won, câu lưu hoặc phạt tiền nhẹ",
        "Không thể xử phạt nếu nạn nhân không muốn xử phạt"
      ],
      [
        "Gây thương tích",
        "Điều 257 Bộ luật Hình sự",
        "Tù đến 7 năm, đình chỉ tư cách đến 10 năm hoặc phạt tiền đến 10 triệu won",
        "Vẫn có thể bị xử phạt dù đã thỏa thuận"
      ],
      [
        "Gây thương tích đặc biệt",
        "Điều 258-2 Bộ luật Hình sự",
        "Tù từ 1 năm đến 10 năm",
        "Không có hình phạt tiền"
      ],
      [
        "Lái xe khi say rượu (từ 0,03% đến dưới 0,08%)",
        "Điều 148-2 Luật Giao thông Đường bộ",
        "Tù đến 1 năm hoặc phạt tiền đến 5 triệu won",
        "Tăng nặng nếu tái phạm trong vòng 10 năm kể từ ngày bản án phạt tiền trở lên có hiệu lực"
      ],
      [
        "Lái xe khi say rượu (từ 0,08% đến dưới 0,2%)",
        "Điều 148-2 Luật Giao thông Đường bộ",
        "Tù từ 1 năm đến 2 năm hoặc phạt tiền từ 5 triệu đến 10 triệu won",
        "Tăng nặng nếu tái phạm trong vòng 10 năm kể từ ngày bản án phạt tiền trở lên có hiệu lực"
      ],
      [
        "Lái xe khi say rượu (từ 0,2% trở lên)",
        "Điều 148-2 Luật Giao thông Đường bộ",
        "Tù từ 2 năm đến 5 năm hoặc phạt tiền từ 10 triệu đến 20 triệu won",
        "Nếu tái phạm trong vòng 10 năm sau khi bản án phạt tiền trở lên có hiệu lực: tù từ 2 năm đến 6 năm hoặc phạt tiền từ 10 triệu đến 30 triệu won"
      ],
      [
        "Từ chối đo nồng độ cồn",
        "Điều 148-2 Luật Giao thông Đường bộ",
        "Tù từ 1 năm đến 5 năm hoặc phạt tiền từ 5 triệu đến 20 triệu won",
        ""
      ],
      [
        "Lái xe nguy hiểm gây thương tích",
        "Điều 5-11 Luật Tăng nặng Hình phạt đối với Tội phạm Đặc định",
        "Tù từ 1 năm đến 15 năm hoặc phạt tiền từ 10 triệu đến 30 triệu won",
        "Nếu gây chết người: tù chung thân hoặc tù từ 3 năm trở lên"
      ]
    ],
    "note": "Khung hình phạt là phạm vi xử phạt do luật quy định. Quyết định xử lý và mức án thực tế khác nhau tùy tiền án, việc khắc phục thiệt hại, có thỏa thuận hay không… Theo pháp luật hiện hành tại thời điểm tháng 10 năm 2026."
  },
  "points": {
    "title": "Vì sao nên liên hệ trước buổi lấy lời khai",
    "items": [
      {
        "title": "Lời khai đầu tiên được ghi lại trong biên bản",
        "desc": "Lời khai đã ký trong biên bản trở thành tài liệu cơ bản để quyết định có chuyển hồ sơ và có truy tố hay không. Nếu lời nói ban đầu và lời nói sau này khác nhau, cơ quan điều tra dễ cho rằng toàn bộ lời khai khó tin."
      },
      {
        "title": "Khi bị bắt, mọi việc được quyết định trong 48 giờ",
        "desc": "Nếu không yêu cầu ra lệnh tạm giam trong vòng 48 giờ kể từ khi bắt thì phải thả người (Điều 200-2 Luật Tố tụng hình sự…). Tài liệu nộp cho phiên thẩm tra lệnh bắt giam phải được chuẩn bị trong khoảng thời gian đó."
      },
      {
        "title": "Từ tháng 10 năm 2026, công tố viên không trực tiếp điều tra",
        "desc": "Viện Kiểm sát bị bãi bỏ; Văn phòng Công tố đảm nhận việc truy tố, còn cảnh sát và Cơ quan Điều tra Tội phạm Nghiêm trọng đảm nhận việc điều tra. Công tố viên xem hồ sơ để quyết định và yêu cầu điều tra bổ sung nếu thiếu, nên lời khai và tài liệu để lại ở giai đoạn điều tra có thể càng có trọng lượng hơn."
      },
      {
        "title": "Bản ý kiến phải nộp trước khi có kết luận",
        "desc": "Bản ý kiến phải nộp trước khi cảnh sát quyết định có chuyển hồ sơ hay không và trước khi công tố viên quyết định có truy tố hay không thì mới được xem xét. Ngay sau buổi lấy lời khai, khi trí nhớ còn rõ, là lúc tốt để viết bản ý kiến."
      }
    ]
  },
  "processes": [
    {
      "title": "Thủ tục bào chữa cho người bị nghi vấn",
      "steps": [
        {
          "title": "Tư vấn trực tiếp",
          "desc": "Luật sư điều hành trực tiếp tư vấn. Trước hết chúng tôi xác định đó là cáo buộc gì, tin nhắn yêu cầu đến làm việc ghi những gì, và bạn đang có những tài liệu nào."
        },
        {
          "title": "Định hướng và thu thập chứng cứ",
          "desc": "Chúng tôi quyết định tranh chấp hay thừa nhận cáo buộc. Những tài liệu có thể bị xóa hoặc ghi đè như CCTV, tin nhắn, lịch sử chuyển tiền được thu thập trước."
        },
        {
          "title": "Luyện tập trước buổi lấy lời khai",
          "desc": "Chúng tôi chọn các câu hỏi dự kiến và luyện tập trước như buổi lấy lời khai thật, giúp bạn tránh bối rối rồi nói khác đi trong phòng lấy lời khai, và nhắc bạn không lấp chỗ mình không nhớ bằng phỏng đoán."
        },
        {
          "title": "Đi cùng khi lấy lời khai",
          "desc": "Chúng tôi vào phòng lấy lời khai cùng bạn. Với câu hỏi mang tính dẫn dắt hoặc không đúng, chúng tôi nêu ý kiến ngay tại chỗ, và trước khi ký thì cùng kiểm tra xem biên bản có chỗ nào ghi khác với lời khai không."
        },
        {
          "title": "Nộp bản ý kiến của luật sư",
          "desc": "Sau buổi lấy lời khai, chúng tôi nộp cho cảnh sát và công tố viên bản ý kiến trình bày kèm chứng cứ rằng không có tội hoặc tội nhẹ. Nếu là vụ việc thừa nhận, chúng tôi nộp kèm tài liệu về việc khắc phục thiệt hại và sự hối lỗi."
        }
      ]
    },
    {
      "title": "Thủ tục đại diện tố cáo (người bị hại)",
      "steps": [
        {
          "title": "Phân tích thiệt hại và chứng cứ",
          "desc": "Chúng tôi xem xét các yếu tố cấu thành tội phạm, chọn chứng cứ chính và lập chiến lược. Tố cáo không đủ yếu tố cấu thành có thể dẫn đến tranh cãi về tội vu cáo, nên chúng tôi sàng lọc ngay ở bước này."
        },
        {
          "title": "Soạn và nộp đơn tố cáo",
          "desc": "Chúng tôi trình bày sao cho cơ quan điều tra nhìn vào là hiểu ngay khi nào, ai, đã làm gì, rồi nộp kèm danh mục chứng cứ."
        },
        {
          "title": "Luyện tập trước buổi lấy lời khai người tố cáo",
          "desc": "Chúng tôi xem trước những lập luận phản bác mà phía bên kia có thể đưa ra và chuẩn bị để lời khai của bạn không bị dao động."
        },
        {
          "title": "Đi cùng khi lấy lời khai người tố cáo",
          "desc": "Chúng tôi đi cùng bạn đến buổi lấy lời khai để hỗ trợ việc trình bày và kiểm tra cuộc điều tra đã tiến triển đến đâu."
        },
        {
          "title": "Kiến nghị xử phạt nghiêm và khắc phục thiệt hại",
          "desc": "Chúng tôi nộp bản ý kiến cho biết bạn muốn người kia bị xử phạt, và khi có đề nghị thỏa thuận thì hỗ trợ theo hướng bạn được khắc phục thiệt hại. Nếu có quyết định không chuyển hồ sơ, chúng tôi xem xét việc nộp đơn phản đối."
        }
      ]
    }
  ],
  "lawyers": [
    {
      "slug": "kim-hansol",
      "note": "Nguyên công tố viên Viện Kiểm sát Địa phương Incheon · Chi nhánh Ansan của Viện Kiểm sát Địa phương Suwon · Chi nhánh Hongseong của Viện Kiểm sát Địa phương Daejeon"
    },
    {
      "slug": "koo-bonwoo",
      "note": "Các vụ án hình sự kinh tế như vi phạm Luật Thị trường Vốn, lừa đảo đầu tư, biển thủ, bội tín"
    }
  ],
  "faqs": [
    {
      "q": "Cảnh sát liên lạc yêu cầu tôi đến làm việc. Tôi có phải đến ngay không?",
      "a": "Bạn có thể thỏa thuận với điều tra viên để điều chỉnh ngày giờ đến làm việc. Thay vì vội vàng, an toàn hơn là xác định đó là cáo buộc gì và định hướng lời khai rồi mới đến. Luật sư có thể tham gia buổi lấy lời khai người bị nghi vấn (Điều 243-2 Luật Tố tụng hình sự)."
    },
    {
      "q": "Khi bị cảnh sát lấy lời khai, tôi có bắt buộc phải khai không?",
      "a": "Người bị nghi vấn có quyền từ chối khai báo. Bạn có thể không trả lời tất cả hoặc một phần câu hỏi, và không bị bất lợi vì điều đó (Điều 244-3 Luật Tố tụng hình sự). Tuy nhiên, tùy vụ việc, có khi chủ động giải thích lại tốt hơn, nên khai đến đâu sẽ được quyết định sau khi xem tài liệu trước buổi lấy lời khai."
    },
    {
      "q": "Người nhà tôi bị bắt. Bây giờ tôi phải làm gì?",
      "a": "Việc có yêu cầu ra lệnh tạm giam hay không sẽ được quyết định trong vòng 48 giờ kể từ khi bị bắt. Luật sư có thể gặp người bị bắt ngay sau khi bắt, nên hãy liên hệ ngay. Nếu có yêu cầu ra lệnh, thẩm phán sẽ trực tiếp thẩm vấn người bị nghi vấn (Điều 201-2 Luật Tố tụng hình sự); chúng tôi chuẩn bị bản ý kiến nộp lúc đó cùng tài liệu về nơi ở, công việc và quan hệ gia đình. Chúng tôi nhận điện thoại 24 giờ, kể cả cuối tuần và ngày lễ."
    },
    {
      "q": "Tôi đã lấy lời khai xong và được báo là hồ sơ đã được chuyển đi. Tiếp theo sẽ thế nào?",
      "a": "Khi hồ sơ được chuyển, công tố viên sẽ quyết định có truy tố hay không. Từ ngày 2/10/2026, Viện Kiểm sát bị bãi bỏ và công tố viên của Văn phòng Công tố đảm nhận việc truy tố; công tố viên không trực tiếp điều tra mà yêu cầu cảnh sát điều tra bổ sung nếu cần (Điều 197-2 Luật Tố tụng hình sự). Trước khi có quyết định truy tố, bạn có thể nộp bản ý kiến của luật sư để đề nghị quyết định không có dấu hiệu phạm tội (혐의없음) hoặc tạm hoãn truy tố (기소유예)."
    },
    {
      "q": "Tôi bị tố cáo tội biển thủ vì đã dùng tiền của công ty. Tôi có bị tạm giam ngay không?",
      "a": "Bị tố cáo không có nghĩa là bị tạm giam ngay. Thẩm phán quyết định tạm giam khi có lý do đáng kể để nghi ngờ đã phạm tội và người đó không có nơi ở cố định, có nguy cơ tiêu hủy chứng cứ hoặc bỏ trốn (Điều 70, Điều 201 Luật Tố tụng hình sự). Trong vụ biển thủ, trước hết sẽ tranh chấp xem số tiền đó có phải tiền giữ hộ công ty không, có được dùng trong phạm vi thẩm quyền không; số tiền thiệt hại và việc đã hoàn trả hay chưa ảnh hưởng lớn đến quyết định xử lý."
    },
    {
      "q": "Tôi không trả được khoản tiền đã vay và bị tố cáo tội lừa đảo.",
      "a": "Điều cốt lõi là khi vay bạn có ý định và khả năng trả hay không. Nếu sau khi vay hoàn cảnh xấu đi nên không trả được, có thể không cấu thành tội lừa đảo. Việc đánh giá dựa trên thời điểm vay, nên hãy sắp xếp theo thứ tự thời gian thu nhập và tài sản lúc đó, các khoản đã trả từ trước đến nay và tin nhắn hai bên đã trao đổi."
    },
    {
      "q": "Nếu thỏa thuận với nạn nhân thì tôi có bị xử phạt không?",
      "a": "Tùy tội danh. Với những tội không thể xử phạt nếu nạn nhân không muốn xử phạt (반의사불벌죄) như hành hung, đe dọa, phỉ báng, vụ việc có thể kết thúc bằng thỏa thuận. Với các tội như gây thương tích, lừa đảo, biển thủ, dù đã thỏa thuận vẫn có thể bị xử phạt, nhưng thỏa thuận được xem là tình tiết có lợi khi quyết định xử lý và mức án. Thời điểm và cách thức thỏa thuận cũng ảnh hưởng đến kết quả. Nếu bạn khó liên lạc trực tiếp với nạn nhân, Jisan sẽ thay bạn liên lạc để thỏa thuận."
    },
    {
      "q": "Tôi lo nội dung tư vấn bị lộ ra ngoài.",
      "a": "Theo Luật Luật sư, luật sư phải giữ bí mật biết được trong khi hành nghề (Điều 26 Luật Luật sư). Việc bạn đã tư vấn và nội dung tư vấn sẽ không được tiết lộ ra ngoài nếu không có sự đồng ý của khách hàng."
    }
  ],
  "form": {
    "caseType": "Hình sự",
    "stageOptions": [
      "Nhận yêu cầu đến làm việc (trước buổi lấy lời khai)",
      "Đã lấy lời khai, đang chờ kết quả hoặc đã chuyển hồ sơ",
      "Bị bắt, tạm giam",
      "Bị khám xét, thu giữ",
      "Đang xét xử",
      "Người bị hại (chuẩn bị tố cáo)"
    ]
  },
  "closing": "Nếu đã có ngày lấy lời khai, hãy liên hệ với chúng tôi trước khi đến."
}
