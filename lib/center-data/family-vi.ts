import type { Center } from "@/lib/centers"

/**
 * family center (vi, /vi/family). scratchpad 번역 원문(형사센터 / 이혼·상간·상속센터 합본)을 옮긴 것
 * 법률 내용(조문·기간·요건)은 게시 전 담당 변호사 검수가 필요합니다.
 */
export const familyVi: Center = {
  "slug": "family-vi",
  "lang": "vi",
  "basePath": "/vi/family",
  "alternates": {
    "ko": "/divorce",
    "en": "/en/family",
    "zh": "/zh/family",
    "vi": "/vi/family",
    "ru": "/ru/family",
    "mn": "/mn/family"
  },
  "name": "Trung tâm Hôn nhân và Gia đình",
  "summary": "Ly hôn, chia tài sản, quyền nuôi con; kiện người thứ ba đòi bồi thường tổn thất tinh thần và ứng phó khi bị kiện vì ngoại tình; từ chối thừa kế, chấp nhận thừa kế có giới hạn, phân chia di sản, phần di sản bắt buộc",
  "tone": "warm",
  "seo": {
    "title": "Luật sư ly hôn, ngoại tình, thừa kế Hàn Quốc | Chia tài sản · Quyền nuôi con · Bồi thường tinh thần · Từ chối thừa kế · Phần di sản bắt buộc | Trung tâm Hôn nhân và Gia đình Jisan",
    "description": "Thuận tình ly hôn và kiện ly hôn tại Hàn Quốc, chia tài sản, quyền nuôi con và tiền cấp dưỡng nuôi con, bồi thường tổn thất tinh thần khi vợ/chồng ngoại tình, ứng phó khi bị kiện vì ngoại tình, từ chối thừa kế, chấp nhận thừa kế có giới hạn, phân chia di sản và phần di sản bắt buộc – Trung tâm Hôn nhân và Gia đình của Văn phòng Luật Jisan đồng hành cùng bạn. Điện thoại 24 giờ: 02-6951-4097.",
    "keywords": [
      "luật sư ly hôn Hàn Quốc",
      "ly hôn có yếu tố nước ngoài Hàn Quốc",
      "chia tài sản khi ly hôn Hàn Quốc",
      "quyền nuôi con Hàn Quốc",
      "kiện người thứ ba ngoại tình Hàn Quốc",
      "bồi thường tổn thất tinh thần ngoại tình",
      "từ chối thừa kế Hàn Quốc",
      "chấp nhận thừa kế có giới hạn",
      "phân chia di sản thừa kế Hàn Quốc",
      "luật sư thừa kế Hàn Quốc"
    ]
  },
  "hero": {
    "title": "Chuyện pháp lý trong gia đình,\nbạn không phải gánh một mình",
    "sub": "Ly hôn và chia tài sản, việc nuôi con, vợ/chồng ngoại tình, chuyện thừa kế sau khi người thân qua đời. Với những việc gia đình được giải quyết tại tòa án Hàn Quốc, Trung tâm Hôn nhân và Gia đình của Văn phòng Luật Jisan sẽ đồng hành cùng bạn từ buổi tư vấn đầu tiên cho đến sau khi có bản án."
  },
  "stageTitle": "Bạn đang ở trong tình huống nào?",
  "stages": [
    {
      "label": "Tôi đã quyết định ly hôn nhưng không biết bắt đầu từ đâu",
      "hint": "Trước hết xem nên thuận tình ly hôn hay khởi kiện →",
      "href": "#process"
    },
    {
      "label": "Tôi nhận được đơn kiện ly hôn của vợ/chồng",
      "hint": "Bản tự bảo vệ phải nộp trong 30 ngày kể từ ngày nhận →",
      "href": "#consult"
    },
    {
      "label": "Tôi phát hiện vợ/chồng ngoại tình",
      "hint": "Cùng sắp xếp chứng cứ trước →",
      "href": "#consult"
    },
    {
      "label": "Tôi bị kiện vì ngoại tình",
      "hint": "Hạn nộp bản tự bảo vệ là 30 ngày →",
      "href": "#process"
    },
    {
      "label": "Cha mẹ tôi qua đời, tôi không biết có nợ hay không",
      "hint": "Tra cứu tài sản và nợ trong vòng 3 tháng →",
      "href": "#process"
    },
    {
      "label": "Anh chị em tôi không thống nhất được cách chia di sản",
      "hint": "Trước khi đóng dấu, hãy xem xét lợi ích đặc biệt và phần đóng góp →",
      "href": "#consult"
    },
    {
      "label": "Vợ/chồng tôi liên tục chửi mắng, đánh đập",
      "hint": "Gọi ngay →",
      "href": "tel:02-6951-4097",
      "urgent": true
    }
  ],
  "intro": {
    "title": "Chuyện gia đình, bạn không phải lo một mình",
    "body": [
      "Vì là chuyện với người gần gũi nhất nên rất khó nói với ai. Dù vậy, thay vì để cảm xúc dẫn dắt, trước hết cần xác định những vấn đề phải giải quyết: lý do ly hôn, quá trình hình thành tài sản, môi trường nuôi dạy con. Trung tâm Hôn nhân và Gia đình của Văn phòng Luật Jisan không khuyên bạn ly hôn bằng mọi giá. Chúng tôi lắng nghe bạn đang ở trong hoàn cảnh nào và điều bạn muốn giữ gìn nhất là gì, rồi mới định hướng.",
      "Khi phát hiện vợ/chồng ngoại tình, hay khi bị kiện vì ngoại tình, kết quả thường không phụ thuộc vào mức độ tổn thương mà vào việc bạn đưa tài liệu nào ra tòa và bằng cách nào. Sau khi người thân qua đời, mỗi thủ tục đều có thời hạn, như thời hạn 3 tháng để từ chối thừa kế hoặc chấp nhận thừa kế có giới hạn, nên việc đầu tiên là xác định thứ tự cần làm.",
      "Ly hôn là nhiều nút thắt đan xen giữa tài sản, con cái và cảm xúc. Nếu có thể kết thúc bằng thỏa thuận, hãy ghi rõ các điều kiện bằng văn bản để giảm mầm mống tranh chấp về sau; nếu cần kiện, chúng tôi chứng minh lý do ly hôn theo luật định bằng chứng cứ. Bạn có thể đến tư vấn tại văn phòng chính ở Seoul và các văn phòng chi nhánh Incheon, Hongseong, Songpa. Số 02-6951-4097 hoạt động 24 giờ, kể cả cuối tuần và ngày lễ."
    ]
  },
  "situations": {
    "title": "Bạn có đang một mình mang những nỗi lo này?",
    "items": [
      "Tôi hoàn toàn không biết phải bắt đầu từ đâu",
      "Toàn bộ tài sản đứng tên vợ/chồng, tôi không biết mình có được chia không",
      "Ngày nào tôi cũng lo không giữ được con",
      "Có dấu hiệu ngoại tình nhưng chứng cứ nằm rải rác khắp nơi",
      "Một ngày bỗng nhận được đơn kiện ngoại tình từ tòa án",
      "Tôi không biết người đó đã có gia đình, vậy mà bị đòi bồi thường",
      "Bố tôi qua đời, tôi hoàn toàn không biết ông còn nợ bao nhiêu",
      "Tôi chăm sóc cha mẹ hơn 10 năm, vậy mà anh chị em đòi chia đều",
      "Có một người anh/em đã mất liên lạc nên không thể lập văn bản thỏa thuận"
    ]
  },
  "areasTitle": "Lĩnh vực của Trung tâm Hôn nhân và Gia đình",
  "areas": [
    {
      "name": "Thuận tình ly hôn",
      "law": "Bộ luật Dân sự Điều 834, Điều 836-2",
      "desc": "Thủ tục vợ chồng thỏa thuận về việc ly hôn và quyền cha mẹ (친권), việc nuôi con, rồi được Tòa án Gia đình xác nhận. Tòa án không xác nhận việc chia tài sản (재산분할) và tiền bồi thường tổn thất tinh thần (위자료), nên cần lập văn bản thỏa thuận thật kỹ để tránh tranh chấp về sau."
    },
    {
      "name": "Ly hôn theo phán quyết của tòa · Bồi thường tổn thất tinh thần",
      "law": "Bộ luật Dân sự Điều 840, Điều 843",
      "desc": "Nếu bên kia không chịu ly hôn, cần chứng minh lý do ly hôn theo luật định để kết thúc bằng bản án. Đồng thời yêu cầu người vợ/chồng có lỗi làm hôn nhân tan vỡ bồi thường tổn thất tinh thần."
    },
    {
      "name": "Chia tài sản (bất động sản · trợ cấp thôi việc · lương hưu)",
      "law": "Bộ luật Dân sự Điều 839-2",
      "desc": "Tài sản được chia là tài sản vợ chồng cùng tạo dựng trong hôn nhân, bất kể đứng tên ai. Chúng tôi lập danh sách từ bất động sản, tiền gửi, cổ phiếu đến trợ cấp thôi việc và lương hưu, rồi xem xét mức đóng góp, kể cả việc nội trợ và nuôi con của người nội trợ toàn thời gian, để tính phần được chia."
    },
    {
      "name": "Quyền cha mẹ · Quyền nuôi con · Quyền thăm gặp con",
      "law": "Bộ luật Dân sự Điều 837, Điều 837-2, Điều 909",
      "desc": "Tòa án chỉ định người có quyền cha mẹ (친권자) và người nuôi con (양육자) dựa trên phúc lợi của con. Chúng tôi sắp xếp tài liệu về việc ai đã chăm sóc con từ trước đến nay và sẽ nuôi con thế nào sau ly hôn để chuẩn bị cho điều tra gia sự (가사조사), đồng thời thống nhất cách thức thăm gặp con (면접교섭)."
    },
    {
      "name": "Yêu cầu và thu tiền cấp dưỡng nuôi con",
      "law": "Luật Tố tụng Gia sự Điều 63-2, Điều 64",
      "desc": "Yêu cầu tiền cấp dưỡng nuôi con (양육비) dựa trên Bảng tiêu chuẩn tính tiền cấp dưỡng nuôi con, và khi hoàn cảnh thay đổi thì yêu cầu tăng hoặc giảm. Nếu bên kia không trả khoản đã định, chúng tôi thu bằng lệnh thực hiện nghĩa vụ (이행명령) và lệnh chi trả trực tiếp (직접지급명령)."
    },
    {
      "name": "Chấm dứt hôn nhân thực tế",
      "law": "Áp dụng tương tự Bộ luật Dân sự Điều 839-2 (án lệ)",
      "desc": "Dù không đăng ký kết hôn, nếu được công nhận là hôn nhân thực tế (사실혼) thì vẫn có thể yêu cầu chia tài sản và bồi thường tổn thất tinh thần. Trước hết chúng tôi chứng minh quan hệ hôn nhân thực tế bằng tài liệu như lễ cưới, buổi ra mắt hai gia đình, việc cùng chi trả sinh hoạt phí."
    },
    {
      "name": "Kiện người thứ ba đòi bồi thường tổn thất tinh thần",
      "law": "Bộ luật Dân sự Điều 750, Điều 751",
      "desc": "Yêu cầu người có hành vi không chung thủy với vợ/chồng của bạn (상간자) bồi thường thiệt hại tinh thần. Chúng tôi sắp xếp diễn biến, thời gian của hành vi không chung thủy và mức độ quan hệ hôn nhân bị xâm hại để xác định số tiền và phạm vi yêu cầu."
    },
    {
      "name": "Sắp xếp chứng cứ ngoại tình · Bảo toàn chứng cứ",
      "law": "Luật Tố tụng dân sự Điều 375",
      "desc": "Chúng tôi xếp KakaoTalk, ảnh, lịch sử thanh toán, lộ trình di chuyển theo thứ tự thời gian để tìm điểm cần chứng minh. Với tài liệu sắp bị xóa như camera CCTV ở nhà nghỉ, khách sạn, có thể xin tòa án bảo toàn chứng cứ (증거보전) ngay cả trước khi khởi kiện."
    },
    {
      "name": "Ứng phó khi bị kiện vì ngoại tình (bị đơn)",
      "law": "Luật Tố tụng dân sự Điều 256",
      "desc": "Nộp bản tự bảo vệ (답변서) trong 30 ngày kể từ ngày nhận bản sao đơn khởi kiện. Chúng tôi xem xét có hành vi không chung thủy hay không, bạn có biết người kia đã kết hôn hay không, và lúc đó hôn nhân của họ đã tan vỡ hay chưa, để yêu cầu bác đơn hoặc giảm số tiền."
    },
    {
      "name": "Giảm tiền bồi thường · Xem xét quyền yêu cầu hoàn trả",
      "law": "Bộ luật Dân sự Điều 760",
      "desc": "Dù trách nhiệm được công nhận, vẫn có thể tranh luận về số tiền dựa trên thời gian, hoàn cảnh quen biết và tình trạng hôn nhân lúc đó. Chúng tôi cũng xem xét sau khi trả tiền bồi thường, bạn có thể yêu cầu người vợ/chồng cùng ngoại tình hoàn trả phần trách nhiệm của họ (구상권) hay không."
    },
    {
      "name": "Thư chứng nhận nội dung · Soạn văn bản thỏa thuận",
      "law": "",
      "desc": "Nếu muốn giải quyết mà không cần kiện, có thể kết thúc bằng thư chứng nhận nội dung (내용증명) và thỏa thuận. Văn bản thỏa thuận cần ghi rõ số tiền và hạn trả, cấm liên lạc lại, giữ bí mật, tiền phạt khi vi phạm (위약벌) và việc có được yêu cầu thêm hay không."
    },
    {
      "name": "Tiến hành cùng vụ kiện ly hôn",
      "law": "Luật Tố tụng Gia sự Điều 2 (vụ việc loại Da)",
      "desc": "Nếu ly hôn, bạn có thể kiện cả vợ/chồng và người thứ ba cùng một lúc tại Tòa án Gia đình. Nếu không ly hôn mà chỉ kiện người thứ ba, đơn kiện được nộp tại tòa án dân sự."
    },
    {
      "name": "Từ chối thừa kế · Chấp nhận thừa kế có giới hạn",
      "law": "Bộ luật Dân sự Điều 1019, Điều 1026, Điều 1028, Điều 1041",
      "desc": "Khi nợ của người mất nhiều hơn tài sản hoặc chưa rõ là bao nhiêu, cần khai báo tại Tòa án Gia đình trong 3 tháng kể từ ngày biết việc thừa kế bắt đầu. Chúng tôi xác định trong gia đình ai từ chối thừa kế (상속포기), ai chấp nhận thừa kế có giới hạn (한정승인) để nợ không chuyển sang họ hàng ở hàng thừa kế sau; nếu đã quá hạn, chúng tôi xem có thể chấp nhận thừa kế có giới hạn đặc biệt (특별한정승인) hay không."
    },
    {
      "name": "Phân chia di sản thừa kế",
      "law": "Bộ luật Dân sự Điều 1013, Điều 1015; Luật Tố tụng Gia sự Điều 2, Điều 50",
      "desc": "Văn bản thỏa thuận phải có tất cả người thừa kế tham gia; thiếu dù chỉ một người cũng không có hiệu lực. Nếu có người thừa kế chưa thành niên hoặc anh chị em đã mất liên lạc, trước hết phải chỉ định người đại diện đặc biệt (특별대리인) và người quản lý tài sản của người vắng mặt (부재자재산관리인); nếu không thỏa thuận được thì chia qua hòa giải và thẩm phán (심판) tại Tòa án Gia đình."
    },
    {
      "name": "Yêu cầu hoàn trả phần di sản bắt buộc",
      "law": "Bộ luật Dân sự Điều 1112 ~ Điều 1118",
      "desc": "Nếu tài sản dồn cho một người qua việc tặng cho lúc còn sống hoặc di chúc, con và vợ/chồng có thể yêu cầu 1/2, cha mẹ có thể yêu cầu 1/3 phần thừa kế theo pháp luật làm phần di sản bắt buộc (유류분). Phần di sản bắt buộc của anh chị em ruột đã bị bãi bỏ. Dù bạn là bên yêu cầu hay bên bị yêu cầu, trước hết cần xem thời điểm tặng cho và thời hiệu."
    },
    {
      "name": "Lập di chúc · Kiểm nhận · Di chúc vô hiệu",
      "law": "Bộ luật Dân sự Điều 1060, Điều 1065 ~ Điều 1072, Điều 1091",
      "desc": "Di chúc chỉ có hiệu lực khi tuân thủ hình thức luật định như tự viết tay, ghi âm, công chứng. Với người muốn lập di chúc, chúng tôi hướng dẫn hình thức và câu chữ; với người phát hiện di chúc, chúng tôi hướng dẫn thủ tục kiểm nhận (검인); với người nghi ngờ di chúc, chúng tôi hướng dẫn vụ kiện xác nhận di chúc vô hiệu (유언무효확인), tranh luận về vi phạm hình thức và năng lực ý chí."
    },
    {
      "name": "Phần đóng góp · Lợi ích đặc biệt",
      "law": "Bộ luật Dân sự Điều 1008, Điều 1008-2",
      "desc": "Người thừa kế đã sống cùng, chăm sóc cha mẹ lâu năm hoặc góp phần làm tăng tài sản có thể yêu cầu phần đóng góp (기여분); nếu có người thừa kế đã nhận trước tiền cưới hay nhà cửa, có thể nêu lợi ích đặc biệt (특별수익) để tính lại phần thực tế. Từ tháng 3/2026, khoản tặng cho nhận được để bù đắp cho sự đóng góp sẽ không bị coi là lợi ích đặc biệt trong phạm vi đó."
    },
    {
      "name": "Điều tra di sản · Yêu cầu khôi phục quyền thừa kế",
      "law": "Bộ luật Dân sự Điều 999, Điều 1004, Điều 1004-2",
      "desc": "Chúng tôi xác định tài sản qua Dịch vụ một cửa An tâm thừa kế (안심상속 원스톱서비스 – dịch vụ tra cứu tài sản và nợ của người mất cùng một lúc) và tra cứu giao dịch tài chính, đồng thời truy vết tiền bị rút ra trước và sau khi mất, cũng như việc đăng ký sang tên lén lút. Chúng tôi xem xét yêu cầu khôi phục quyền thừa kế (상속회복청구) đối với người tự xưng là người thừa kế (참칭상속인), yêu cầu xác định mất tư cách thừa kế (상속결격) và tuyên bố tước quyền thừa kế (상속권 상실 선고), và cả việc tố cáo hình sự nếu cần."
    }
  ],
  "table": {
    "title": "Lý do ly hôn theo phán quyết của tòa (Bộ luật Dân sự Điều 840)",
    "nav": "Lý do ly hôn",
    "columns": [
      "Khoản",
      "Lý do ly hôn theo luật định",
      "Những trường hợp thuộc diện này"
    ],
    "rows": [
      [
        "Khoản 1",
        "Khi vợ/chồng có hành vi không chung thủy",
        "Dù chưa đến mức quan hệ tình dục, nếu là hành vi phản bội nghĩa vụ chung thủy của vợ chồng thì vẫn có thể thuộc diện này. Nếu đã đồng ý trước hoặc tha thứ sau đó thì không thể yêu cầu."
      ],
      [
        "Khoản 2",
        "Khi vợ/chồng cố ý bỏ rơi bên kia",
        "Bỏ nhà đi không có lý do chính đáng, cắt tiền sinh hoạt, tức là từ bỏ nghĩa vụ sống chung, cấp dưỡng, hỗ trợ nhau"
      ],
      [
        "Khoản 3",
        "Khi bị vợ/chồng hoặc người thân trực hệ bậc trên của họ đối xử hết sức bất công",
        "Bị vợ/chồng hoặc bố mẹ chồng, bố mẹ vợ đánh đập, ngược đãi, xúc phạm nặng nề"
      ],
      [
        "Khoản 4",
        "Khi người thân trực hệ bậc trên của mình bị vợ/chồng đối xử hết sức bất công",
        "Vợ/chồng chửi mắng, đánh đập cha mẹ của bạn"
      ],
      [
        "Khoản 5",
        "Khi không rõ vợ/chồng còn sống hay đã chết từ 3 năm trở lên",
        "Tình trạng không xác định được vợ/chồng còn sống hay không kéo dài hơn 3 năm"
      ],
      [
        "Khoản 6",
        "Khi có lý do nghiêm trọng khác khiến khó tiếp tục hôn nhân",
        "Ly thân lâu ngày, tan vỡ khó hàn gắn do khác biệt tính cách, cờ bạc, phung phí, chửi mắng kéo dài, v.v."
      ]
    ],
    "note": "Với lý do khoản 1, không thể yêu cầu ly hôn khi đã quá 6 tháng kể từ ngày biết hoặc 2 năm kể từ ngày xảy ra hành vi không chung thủy (Bộ luật Dân sự Điều 841). Lý do khoản 6 cũng bị giới hạn 6 tháng kể từ ngày biết và 2 năm kể từ ngày xảy ra (Bộ luật Dân sự Điều 842), nhưng nếu lý do đó vẫn đang tiếp diễn thì không bị ràng buộc bởi thời hạn này. Những trường hợp còn tranh cãi có thuộc khoản 6 hay không, như khác biệt tính cách, sẽ được đánh giá dựa trên hoàn cảnh cụ thể khi tư vấn."
  },
  "points": {
    "title": "Nguyên tắc của Trung tâm Hôn nhân và Gia đình Jisan",
    "items": [
      {
        "title": "Lắng nghe câu chuyện trước khi đưa ra kết luận",
        "desc": "Cùng là ly hôn nhưng hoàn cảnh mỗi nhà mỗi khác. Nếu bạn vẫn còn đang băn khoăn có nên ly hôn hay không, chúng tôi sẽ cùng bạn sắp xếp lại nỗi băn khoăn đó trước. Bạn không cần vội quyết định."
      },
      {
        "title": "Xem tài sản theo quá trình hình thành, không theo người đứng tên",
        "desc": "Khi chia tài sản, điều quan trọng không phải là ai đứng tên mà là tài sản được tích lũy thế nào trong hôn nhân và ai đã góp bao nhiêu. Nếu tiền trong tài khoản bị chuyển đi hoặc bất động sản bị bán trước thì sẽ khó tranh chấp, nên chúng tôi sắp xếp dòng tiền và tài sản trước tiên."
      },
      {
        "title": "Chỉ thu thập bằng cách hợp pháp",
        "desc": "Lén cài ứng dụng định vị hay ghi âm cuộc trò chuyện giữa những người khác có thể bị xử phạt theo Luật Thông tin vị trí và Luật Bảo vệ bí mật thông tin liên lạc, và đoạn hội thoại ghi âm lén không thể dùng làm chứng cứ tại tòa. Việc vào nhà hay phòng khách sạn của người kia cũng có thể bị coi là xâm nhập chỗ ở trái phép. Hãy kiểm tra cách làm trước khi thu thập."
      },
      {
        "title": "3 tháng trôi qua rất nhanh",
        "desc": "Lo tang lễ, khai tử, tra cứu tài sản, một tháng trôi qua lúc nào không hay. Kết quả tra cứu An tâm thừa kế cũng có thể mất gần 20 ngày tùy cơ quan, nên nếu đang cân nhắc từ chối thừa kế hoặc chấp nhận thừa kế có giới hạn, hãy đăng ký tra cứu ngay khi khai tử và tính ngược từ ngày hết hạn."
      }
    ]
  },
  "processes": [],
  "lawyers": [
    {
      "slug": "kim-hansol",
      "note": "Nguyên công tố viên Viện Kiểm sát Địa phương Incheon · Chi nhánh Ansan Viện Kiểm sát Địa phương Suwon · Chi nhánh Hongseong Viện Kiểm sát Địa phương Daejeon"
    },
    {
      "slug": "kim-miso",
      "note": "Từng làm việc tại Công ty Luật Daehwan · Luật sư nội bộ phòng pháp chế Công ty Cổ phần Wemade · Công ty Luật Oracle"
    }
  ],
  "faqs": [
    {
      "q": "Chỉ vì khác biệt tính cách có ly hôn được không?",
      "a": "Bản thân sự khác biệt tính cách không trực tiếp trở thành lý do ly hôn theo phán quyết của tòa. Tuy nhiên, nếu được công nhận rằng vì thế mà quan hệ hôn nhân đã đổ vỡ đến mức khó hàn gắn, bạn có thể ly hôn với lý do \"có lý do nghiêm trọng khiến khó tiếp tục hôn nhân\" theo Bộ luật Dân sự Điều 840 khoản 6. Nếu hai người đồng ý thì chỉ cần làm thủ tục thuận tình ly hôn."
    },
    {
      "q": "Người nội trợ toàn thời gian có được chia tài sản không?",
      "a": "Có. Việc chia tài sản được quyết định không theo người đứng tên mà theo mức đóng góp vào tài sản vợ chồng cùng tích lũy và giữ gìn trong hôn nhân, và việc nội trợ, nuôi con cũng được công nhận là đóng góp. Tỷ lệ chia khác nhau tùy từng vụ, phụ thuộc vào thời gian hôn nhân, quá trình hình thành tài sản, việc hai vợ chồng có cùng đi làm hay không, v.v."
    },
    {
      "q": "Tiền cấp dưỡng nuôi con được bao nhiêu và đến khi nào?",
      "a": "Tiền cấp dưỡng nuôi con được xác định có tham khảo \"Bảng tiêu chuẩn tính tiền cấp dưỡng nuôi con\" của Tòa án Gia đình Seoul, phản ánh thu nhập của cha mẹ, độ tuổi và số con; về nguyên tắc được nhận cho đến khi con thành niên. Nếu có hoàn cảnh đặc biệt như con bị bệnh hay chi phí học tập thì có thể được cộng thêm, và sau đó nếu hoàn cảnh thay đổi thì có thể yêu cầu tăng hoặc giảm."
    },
    {
      "q": "Không ly hôn mà chỉ đòi người thứ ba bồi thường có được không?",
      "a": "Được. Yêu cầu người thứ ba bồi thường tổn thất tinh thần là quyền riêng biệt với việc ly hôn, nên có thể yêu cầu ngay cả khi vẫn duy trì hôn nhân; trường hợp này bạn nộp đơn kiện đòi bồi thường thiệt hại tại tòa án dân sự. Tuy nhiên, mức độ xâm hại hôn nhân bị đánh giá thấp hơn so với trường hợp dẫn đến ly hôn, nên số tiền được công nhận có thể ít hơn."
    },
    {
      "q": "Nhận được đơn kiện ngoại tình mà bỏ mặc thì sẽ thế nào?",
      "a": "Nếu không nộp bản tự bảo vệ trong 30 ngày kể từ ngày nhận bản sao đơn khởi kiện, tòa án có thể coi như bạn đã thừa nhận các lời khai của nguyên đơn và tuyên án mà không cần tranh tụng (Luật Tố tụng dân sự Điều 256, Điều 257). Số tiền yêu cầu có thể được chấp nhận nguyên vẹn, nên hãy ứng phó trong thời hạn. Cũng nên tránh liên lạc trực tiếp với nguyên đơn hoặc vợ/chồng của họ để giải thích."
    },
    {
      "q": "Nên từ chối thừa kế hay chấp nhận thừa kế có giới hạn?",
      "a": "Nếu nợ chắc chắn nhiều hơn tài sản và gần như không có tài sản để nhận, từ chối thừa kế là đơn giản. Nếu không biết tài sản hay nợ nhiều hơn, hoặc lo rằng nếu từ chối thì nợ sẽ chuyển sang họ hàng ở hàng thừa kế sau, hãy cân nhắc chấp nhận thừa kế có giới hạn. Với chấp nhận thừa kế có giới hạn, bạn chỉ phải trả nợ trong phạm vi tài sản được thừa kế, nhưng sau khi được chấp thuận phải tự làm thủ tục thanh lý như đăng thông báo và phân chia cho các chủ nợ."
    },
    {
      "q": "Quá 3 tháng tôi mới biết có nợ, không còn cách nào sao?",
      "a": "Nếu bạn không biết nợ nhiều hơn tài sản mà không phải do lỗi nghiêm trọng, bạn có thể chấp nhận thừa kế có giới hạn trong 3 tháng kể từ ngày biết điều đó (Bộ luật Dân sự Điều 1019 khoản 3). Ngày đầu tiên nhận đơn kiện hoặc thư đòi nợ thường được lấy làm mốc, nên hãy giữ lại phong bì và ghi ngày nhận. Trường hợp này chỉ có thể chấp nhận thừa kế có giới hạn, không thể từ chối thừa kế."
    },
    {
      "q": "Anh chị em ruột có được yêu cầu phần di sản bắt buộc không?",
      "a": "Hiện nay thì không. Ngày 25/4/2024, Tòa án Hiến pháp đã tuyên bố quy định về phần di sản bắt buộc của anh chị em ruột là vi hiến, và Bộ luật Dân sự Điều 1112 điểm 4 cũng đã bị xóa bỏ. Phần di sản bắt buộc chỉ được công nhận cho con và vợ/chồng (1/2 phần thừa kế theo pháp luật) và cha mẹ (1/3)."
    }
  ],
  "form": {
    "caseType": "Hôn nhân và gia đình",
    "stageOptions": [
      "Tôi đang cân nhắc hoặc chuẩn bị ly hôn",
      "Tôi đã nộp hoặc nhận được đơn kiện ly hôn",
      "Tôi muốn đòi người thứ ba bồi thường vì vợ/chồng ngoại tình",
      "Tôi nhận được đơn kiện ngoại tình hoặc thư chứng nhận nội dung",
      "Tôi đang tìm hiểu về từ chối thừa kế, chấp nhận thừa kế có giới hạn",
      "Vấn đề phân chia di sản, phần di sản bắt buộc, di chúc"
    ]
  },
  "closing": "Nếu bạn không biết phải bắt đầu từ đâu, hãy kể cho chúng tôi nghe câu chuyện của bạn."
}
