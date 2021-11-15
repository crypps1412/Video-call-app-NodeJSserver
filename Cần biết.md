# Video-call-app-NodeJSserver
Cách tạo một trang web gọi video tương tự như zoom, meet. Nguồn mình tham khảo ở dưới đây:
    Nguồn: Web Dev Simplified
    Youtube Url: https://www.youtube.com/watch?v=DvlyzDZDEq4

Đây là một sản phẩm tái tạo lại những thành quả đã có, với mục đích lấy thêm kinh nghiệm, chuẩn bị cho các dự án về sau và để cho vui.

I,    Mục tiêu.
  - Một trang web cho bạn nhập vào nickname, tên phòng chat, mật khẩu phòng chat. Bạn có thể chọn tạo phòng hoặc gia nhập phòng có sẵn, sẽ hiện tên những phòng hiện có ở dưới. Nếu phòng tạo đã tồn tại, hoặc phòng gia nhập không tồn tại, sai tên, sai mật khẩu thì hệ thống sẽ báo lỗi. Khi vào phòng, bạn sẽ được nói chuyện qua video trực tiếp với những người đang ở trong phòng và những người mới vào, dưới mỗi video đều có nickname từng người. Có 4 yếu tố nhấn được ở trong phòng: mở to một video của ai đó, tắt cam, tắt mic và rời khỏi phòng. Khi mọi người đều rời khỏi phòng thì phòng sẽ biến mất.
II,   Các yếu tố cần thiết.
  - Một máy chủ (server) để xử lý id của phòng, tên phòng và mật khẩu, id của người dùng và tên người dùng, làm nhiệm vụ nhận gửi hoặc trung gian cho các người dùng (user, hay máy khách - client) liên lạc với nhau. (Ở đây mình sử dụng local server tạo ra trong môi trường NodeJs)
  - Một trang web tạo giao diện cho người dùng sử dụng các ngôn ngữ html, css, javascript.
III,  Cách thức hoạt động (kịch bản).
  - Một trang web dạng login form, sẽ cho bạn nhập tên người dùng, tên phòng, mật khẩu phòng và tự động tạo 1 id ngẫu nhiên cho bạn. Các thông số này sẽ được gửi xuống server.
  - Server sẽ xử lý các dữ liệu này: Nếu phòng mới hợp lệ hoặc phòng có sẵn và mật khẩu đúng sẽ trả lời trang web 'Ok' cùng với id phòng do server tạo ra, nếu không sẽ báo lỗi và trang web sẽ hiện cảnh báo.
  - Khi nhận được 'Ok', trang web sẽ dựa vào tên phòng và tên người dùng và id phòng mà chuyển đến trang web mới. Trang mới này là phòng chat được server tạo ra sau khi đã tạo id phòng.
  - Trang chat của bạn sau khi khởi tạo sẽ kết nối vào một peer server nhằm mục đích truyền hình ảnh và âm thanh với một id cá nhân, sau đó gửi yêu cầu thông tin những người trong phòng xuống server
IV,   Cụ thể.

I, The first thing is to understand how a video call work on web.
  - We will need:
    + A server to handle all stream data, user id, room id got from client-side, and send back what the user want (stream videos of other in the room).
    + A webpage using the html, css and javascript (the most important part) technology.
  Well, that is fullstack, you can share the work and just be a frontend or backend developer.
  - Then we need to know how these things work with each other:
    + First of all, when we get access to the website, it will generate a random identified user Id for us.
    + We can create a room whose Id is generated automatically, or select a room by mouse-clicking or inserting room Id.
    + The webpage gets our stream-video from webcam, saves the data in a stream variable, shows us the stream (muted because surely we don't want to here our voice, At All) and sends the room Id and user Id to server together with .
    + The server, after receiving the data, will send the stream and user Id to all other users in the room.
    + When a client receives a new stream from a new user, a new video will be created and show on webpage. 
