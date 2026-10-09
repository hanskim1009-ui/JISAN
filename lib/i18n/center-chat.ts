/**
 * 외국어 센터(채팅으로만 문의) 화면 문구: 전화 안내 문구를 메신저 안내로 바꾼 것.
 * scratchpad chat/install.py 가 번역본으로 다시 만듭니다. 아직 없는 언어는 영어로 보입니다.
 */
export type ChatUi = Record<string, string | { params: string[]; template: string }>

export const CHAT_UI: Record<string, ChatUi> = {
  "en": {
    "consult": "Message us",
    "callAria": "Message us",
    "bandLead": "Send us a message on one of the messengers below. Our staff replies in the chat first and passes your case to the lawyer in charge.",
    "phone24": "Message us",
    "weekendsToo": "You can send a message at any time, including weekends and holidays.",
    "noAddrLine": {
      "params": [
        "names"
      ],
      "template": "{names}: address to be announced"
    },
    "officesNote": "For consultations, please message us through the chat on this page.",
    "faqPageLead": "These are questions we actually hear in consultations. If your situation is different, feel free to message us.",
    "aloneLead": "Tell us in the chat what is happening. Our staff replies first and passes your case to the lawyer in charge, who will tell you the next step.",
    "leaveRequest": "Message us",
    "chatTitle": "Message us",
    "chatNote": "In your first message, please include your name, what happened and any deadline written on documents you received.",
    "wechatId": "WeChat ID",
    "copy": "Copy",
    "copied": "Copied",
    "wechatScan": "Scan this code in WeChat to add us."
  },
  "zh": {
    "consult": "发消息咨询",
    "callAria": "发消息咨询",
    "bandLead": "请通过下方任一即时通讯工具给我们发消息。工作人员会先在聊天中回复，再把案件转交给负责律师。",
    "phone24": "发消息咨询",
    "weekendsToo": "包括周末和节假日在内，随时都可以发消息。",
    "noAddrLine": {
      "params": [
        "names"
      ],
      "template": "{names}：地址另行通知"
    },
    "officesNote": "咨询请通过本页面的聊天给我们发消息。",
    "faqPageLead": "这些都是咨询中实际经常听到的问题。如果您的情况不同，也可以直接发消息询问。",
    "aloneLead": "请在聊天中告诉我们您遇到的情况。工作人员会先回复，再把案件转交给负责律师，由负责律师告诉您下一步该怎么做。",
    "leaveRequest": "发消息咨询",
    "chatTitle": "发消息咨询",
    "chatNote": "第一条消息中请写明您的姓名、发生了什么，以及所收到文件上写明的期限。",
    "wechatId": "微信号",
    "copy": "复制",
    "copied": "已复制",
    "wechatScan": "请用微信扫描此二维码添加我们。"
  },
  "vi": {
    "consult": "Nhắn tin cho chúng tôi",
    "callAria": "Nhắn tin cho chúng tôi",
    "bandLead": "Hãy nhắn tin cho chúng tôi qua một trong các ứng dụng nhắn tin dưới đây. Nhân viên của chúng tôi sẽ trả lời qua chat trước và chuyển vụ việc của bạn cho luật sư phụ trách.",
    "phone24": "Nhắn tin cho chúng tôi",
    "weekendsToo": "Bạn có thể gửi tin nhắn bất cứ lúc nào, kể cả cuối tuần và ngày lễ.",
    "noAddrLine": {
      "params": [
        "names"
      ],
      "template": "{names}: địa chỉ sẽ được thông báo sau"
    },
    "officesNote": "Để được tư vấn, vui lòng nhắn tin cho chúng tôi qua khung chat trên trang này.",
    "faqPageLead": "Đây là những câu hỏi chúng tôi thực sự nhận được khi tư vấn. Nếu tình huống của bạn khác, cứ nhắn tin cho chúng tôi.",
    "aloneLead": "Hãy cho chúng tôi biết qua chat chuyện gì đang xảy ra. Nhân viên của chúng tôi sẽ trả lời trước và chuyển vụ việc cho luật sư phụ trách, người sẽ cho bạn biết bước tiếp theo.",
    "leaveRequest": "Nhắn tin cho chúng tôi",
    "chatTitle": "Nhắn tin cho chúng tôi",
    "chatNote": "Trong tin nhắn đầu tiên, vui lòng cho biết họ tên, chuyện đã xảy ra và thời hạn (nếu có) ghi trên giấy tờ bạn đã nhận.",
    "wechatId": "ID WeChat",
    "copy": "Sao chép",
    "copied": "Đã sao chép",
    "wechatScan": "Quét mã này bằng WeChat để thêm chúng tôi."
  },
  "ru": {
    "consult": "Напишите нам",
    "callAria": "Напишите нам",
    "bandLead": "Напишите нам в одном из мессенджеров ниже. Сотрудник сначала ответит в чате и передаст ваше дело ответственному адвокату.",
    "phone24": "Напишите нам",
    "weekendsToo": "Сообщение можно отправить в любое время, в том числе в выходные и праздники.",
    "noAddrLine": {
      "params": [
        "names"
      ],
      "template": "{names}: адрес будет сообщён позже"
    },
    "officesNote": "Для консультации напишите нам в чат на этой странице.",
    "faqPageLead": "Это вопросы, которые нам действительно задают на консультациях. Если ваша ситуация другая, просто напишите нам.",
    "aloneLead": "Расскажите в чате, что происходит. Сотрудник сначала ответит и передаст ваше дело ответственному адвокату, который подскажет следующий шаг.",
    "leaveRequest": "Напишите нам",
    "chatTitle": "Напишите нам",
    "chatNote": "В первом сообщении укажите, пожалуйста, ваше имя, что произошло и срок, указанный в полученных документах, если он есть.",
    "wechatId": "ID в WeChat",
    "copy": "Копировать",
    "copied": "Скопировано",
    "wechatScan": "Отсканируйте этот код в WeChat, чтобы добавить нас."
  },
  "mn": {
    "consult": "Бидэнд бичих",
    "callAria": "Бидэнд бичих",
    "bandLead": "Доорх мессенжерүүдийн аль нэгээр бидэнд бичээрэй. Манай ажилтан чатаар эхлээд хариулж, таны хэргийг хариуцсан өмгөөлөгчид шилжүүлнэ.",
    "phone24": "Бидэнд бичих",
    "weekendsToo": "Амралтын болон баярын өдрүүдийг оролцуулан хэзээ ч мессеж илгээж болно.",
    "noAddrLine": {
      "params": [
        "names"
      ],
      "template": "{names}: хаягийг дараа мэдэгдэнэ"
    },
    "officesNote": "Зөвлөгөө хүсэх бол энэ хуудсан дээрх чатаар бидэнд бичээрэй.",
    "faqPageLead": "Эдгээр нь зөвлөгөөний үеэр бодитоор сонсдог асуултууд. Таны нөхцөл өөр бол чөлөөтэй бичээрэй.",
    "aloneLead": "Юу болж байгааг чатаар бичээрэй. Манай ажилтан эхлээд хариулж, таны хэргийг хариуцсан өмгөөлөгчид шилжүүлэх бөгөөд өмгөөлөгч дараагийн алхмыг хэлж өгнө.",
    "leaveRequest": "Бидэнд бичих",
    "chatTitle": "Бидэнд бичих",
    "chatNote": "Эхний мессеждээ нэр, юу болсон, хүлээн авсан бичиг баримтад бичигдсэн хугацааг оруулна уу.",
    "wechatId": "WeChat ID",
    "copy": "Хуулах",
    "copied": "Хуулсан",
    "wechatScan": "Биднийг нэмэхийн тулд энэ кодыг WeChat-аар уншуулна уу."
  }
}
