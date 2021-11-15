# Video-call-app-NodeJSserver
Cách tạo một trang web gọi video tương tự như zoom, meet. Nguồn mình tham khảo ở dưới đây:
    *Nguồn: Web Dev Simplified
    Youtube Url: https://www.youtube.com/watch?v=DvlyzDZDEq4*

Đây là một sản phẩm tái tạo lại những thành quả đã có, với mục đích lấy thêm kinh nghiệm, chuẩn bị cho các dự án về sau và để cho vui.

## I,    Mục tiêu.
  - Một trang web cho bạn nhập vào nickname, tên phòng chat, mật khẩu phòng chat. Bạn có thể chọn tạo phòng hoặc gia nhập phòng có sẵn, sẽ hiện tên những phòng hiện có ở dưới. Nếu phòng tạo đã tồn tại, hoặc phòng gia nhập không tồn tại, sai tên, sai mật khẩu thì hệ thống sẽ báo lỗi. Khi vào phòng, bạn sẽ được nói chuyện qua video trực tiếp với những người đang ở trong phòng và những người mới vào, dưới mỗi video đều có nickname từng người. Có 4 yếu tố nhấn được ở trong phòng: mở to một video của ai đó, tắt cam, tắt mic và rời khỏi phòng. Khi mọi người đều rời khỏi phòng thì phòng sẽ biến mất.
## II,   Các yếu tố cần thiết.
  - Một máy chủ (server) để xử lý id của phòng, tên phòng và mật khẩu, id của người dùng và tên người dùng, làm nhiệm vụ nhận gửi hoặc trung gian cho các người dùng (user, hay máy khách - client) liên lạc với nhau. (Ở đây mình sử dụng local server tạo ra trong môi trường NodeJs)
  - Một trang web tạo giao diện cho người dùng sử dụng các ngôn ngữ html, css, javascript.
## III,  Cách thức hoạt động (kịch bản).
  - Một trang web dạng login form, sẽ cho bạn nhập tên người dùng, tên phòng, mật khẩu phòng và tự động tạo 1 id ngẫu nhiên cho bạn. Các thông số này sẽ được gửi xuống server.
  - Server sẽ xử lý các dữ liệu này: Nếu phòng mới hợp lệ hoặc phòng có sẵn và mật khẩu đúng sẽ trả lời trang web 'Ok' cùng với id phòng do server tạo ra, nếu không sẽ báo lỗi và trang web sẽ hiện cảnh báo.
  - Khi nhận được 'Ok', trang web sẽ dựa vào tên phòng và tên người dùng và id phòng mà chuyển đến trang web mới. Trang mới này là phòng chat được server tạo ra sau khi đã tạo id phòng.
  - Trang chat của bạn sau khi khởi tạo, đọc dữ liệu camera và mic thành công, sẽ kết nối vào một peer server với một id cá nhân nhằm mục đích truyền nhận hình ảnh và âm thanh, sau đó gửi yêu cầu thông tin những người trong phòng xuống server
  - Server gửi dữ liệu đã lưu về tên và id người đã ở trong phòng cho trang web, từ đó trang web đối chiếu được thông tin của người ở trong phòng.
  - Trang web sẽ gửi tín hiệu sẵn sàng chiếu trực tiếp cùng với tên và id của bạn cho server, rồi server thông báo cho toàn bộ client đang sử dụng phòng chat. Những client này sẽ kết nối với trang web của bạn qua peer server, gửi dữ liệu video của họ cho bạn và chờ bạn gửi lại video.
  - Trang của bạn sẽ đáp lại cuộc gọi bằng video stream của bạn và đưa video của người dùng khác hiển thị lên, đồng thời đối chiếu với id của họ để chèn tên người dùng vào đúng video.
  - Khi mọi kết nối đã thành công thì ta đã có một cuộc gọi video hoàn chỉnh, có thể thực hiện 4 tương tác đã nói ở trên.
  - Khi rời phòng, trang của bạn sẽ gửi tín hiệu rời tới server và server thông báo cho người dùng khác để xóa video của bạn trên máy họ. Khi tất cả đều out, tên phòng và id phòng sẽ bị xóa.
## IV,   Cụ thể.
  - Trước tiên ta cần tạo một giao diện đăng nhập
```
<!DOCTYPE html>
<html lang="vn">

<head>
    <title>Crypps Chat Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    <h2 style="text-align: center;">CREATE OR JOIN</h2>
    <div id="form">
        <div class="container">
            <label for="uname"><b>Username</b></label>
            <input type="text" placeholder="Enter Username" name="user" id="uname" required>

            <label for="rname"><b>Room</b></label>
            <input type="text" placeholder="Enter Room" name="room" id="rname" required>

            <label for="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="pass" id="psw" required>

            <button onclick="roomCheck('/create-room')">Create a room</button>
            <button onclick="roomCheck('/join-room')">Join a room</button>
        </div>
    </div>
    <label for="rooms"><b>Rooms online:</b></label>
    <input type="text" id="rooms" disabled>
    <hr>
</body>
</html>
```
Trong đó, 3 tag `<input>` sẽ là nơi nhập tên người dùng, tên phòng và mật khẩu. 2 nút nhấn ở dưới, một để tạo phòng mới, một để gia nhập phòng hiện có, khi nhấn sẽ chạy hàm `roomCheck` với 2 đường dẫn để post được truyền vào như tham số. Tên các phòng hiện có sẽ được hiện trong tag `<input>` dưới cùng. Thêm một chút CSS trình bày trang web cho đẹp.
```
<link rel="shortcut icon" href="/Logo.png" />
<style>
    body {
        font-family: Arial, Helvetica, sans-serif;
    }
    
    #form {
        border: 3px solid #f1f1f1;
        max-width: 600px;
        margin: auto;
    }
    
    input[type=text],
    input[type=password] {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }
    
    button {
        background-color: #04AA6D;
        color: white;
        padding: 14px 20px;
        margin: 8px 0;
        border: none;
        cursor: pointer;
        width: 100%;
    }
    
    button:hover {
        opacity: 0.8;
    }
    
    .container {
        padding: 16px;
    }
</style>
```
Ảnh logo `shortcut icon` ở trong máy mình, bạn có thể thay `href` bằng tên ảnh trong máy bạn hoặc link online. Sau khi có được giao diện cơ bản, cần một chút javascript cho trang web hoạt động. Đầu tiên là dữ liệu các phòng có sẵn. Cái này khi load trang phải có ngay để hiện ở tag `<input>` bên trên, nên bạn hãy để 3 dòng dưới đây trong phần `<head>` tránh quên.
```
<script>
    const ROOMS = "<%= rooms %>";
</script>
```
Bước cuối cùng của giao diện đăng nhập là hàm `roomCheck()`.
```
<script>
    document.getElementById('rooms').value = ROOMS;

    function roomCheck(enterMethod) {
        const user = document.getElementById('uname').value;
        const room = document.getElementById('rname').value;
        const pass = document.getElementById('psw').value;

        fetch(enterMethod, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                room: room,
                pass: pass
            })
        }).then(res => res.json()).then(data => {
            if (data.stt === 'Ok')
                window.location.href = '/' + room + '/' + user + '/' + data.id;
            else alert(data.stt);
        }).catch(err => {
            alert('Server err!');
            console.log(err);
        });
    }
</script>
```
Dòng đầu để hiện danh sách tên phòng ngay khi đoạn script này được biên dịch. Ở đây, ta sử dụng `fetch` API để gửi và nhận dữ liệu với server mà không refresh lại trang web như post bằng form thông thường. Url để fetch ở đây chính là biến ta đã truyền vào là `'/create-room'` và `'/join-room'` ở trên, tại sao url chỉ có như vậy thì ở phần server mình sẽ giải thích. Phương thức fetch là `POST`, còn biến truyền đi ở dạng json là tên phòng và mật khẩu. Nếu server trả về 'Ok', ta sẽ được chuyển địa chỉ đến trang chat, còn không thì sẽ báo lỗi. Vậy là kết thúc phần giao diện đăng nhập! ([link file ở đây]())
  - Tiếp theo là 
