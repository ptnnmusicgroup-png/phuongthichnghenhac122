// 1. Thông tin Admin cố định của bạn (Nguyễn Đặng Phương)
const ADMIN_DATA = {
    user: "Phương Thích Nghe Nhạc",
    pass: "ptnn.lovelytimewithmusic",
    name: "Phương Thích Nghe Nhạc (Nguyễn Đặng Phương)"
};

// 2. HÀM XỬ LÝ ĐĂNG KÝ (SIGNUP) - Bổ sung hàm này để nút đăng ký hoạt động
function handleSignup() {
    // Lấy dữ liệu từ các ô input của Form Đăng Ký (ID phải khớp với file HTML)
    const user = document.getElementById('reg-user').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value.trim();

    if (!user || !pass) {
        alert("Phương nhắc nè: Bạn nhớ nhập Tên và Mật khẩu để tạo tài khoản nhé!");
        return;
    }

    // Lấy danh sách thành viên hiện có từ localStorage
    let members = JSON.parse(localStorage.getItem('ptnn_members')) || [];

    // Kiểm tra xem tên tài khoản đã tồn tại chưa (tránh trùng lặp)
    const isExist = members.some(m => m.username.toLowerCase() === user.toLowerCase());
    if (isExist || user === ADMIN_DATA.user) {
        alert("Tên này đã có người dùng, chọn một tên khác cho 'chất' nhé!");
        return;
    }

    // Thêm thành viên mới vào danh sách
    members.push({
        username: user,
        email: email,
        password: pass
    });

    // Lưu lại vào máy (nén thành chuỗi JSON)
    localStorage.setItem('ptnn_members', JSON.stringify(members));

    alert("Đăng ký thành công! Giờ hãy quay lại tab Đăng nhập để vào hệ thống.");
    
    // Tự động chuyển về tab đăng nhập sau khi đăng ký xong
    if (typeof toggleMode === "function") {
        toggleMode('login');
    } else {
        location.reload();
    }
}

// 3. HÀM XỬ LÝ ĐĂNG NHẬP (LOGIN) - Đã cập nhật để kiểm tra cả Admin và User
function checkLogin() {
    const userIn = document.getElementById('username').value.trim();
    const passIn = document.getElementById('password').value.trim();

    if (!userIn || !passIn) {
        alert("Nhập đủ tài khoản và mật khẩu nhé Phương!");
        return;
    }

    // Kiểm tra xem có phải Admin không
    if (userIn === ADMIN_DATA.user && passIn === ADMIN_DATA.pass) {
        const session = {
            name: ADMIN_DATA.name,
            role: "admin",
            isVerified: true
        };
        localStorage.setItem('userSession', JSON.stringify(session));
        alert("Chào Admin Phương! Đang vào hệ thống...");
        window.location.href = "index.html";
        return;
    }

    // Nếu không phải Admin, kiểm tra trong danh sách người dùng đã đăng ký
    let members = JSON.parse(localStorage.getItem('ptnn_members')) || [];
    const foundUser = members.find(m => m.username === userIn && m.password === passIn);

    if (foundUser) {
        const session = {
            name: foundUser.username,
            role: "user",
            isVerified: false
        };
        localStorage.setItem('userSession', JSON.stringify(session));
        window.location.href = "index.html";
    } else {
        alert("Sai tài khoản hoặc mật khẩu rồi, kiểm tra lại nhé!");
    }
}

// 4. Hàm lưu bài đăng (Dùng cho Admin)
function savePostToStorage(content) {
    let posts = JSON.parse(localStorage.getItem('ptnn_database')) || [];
    const newPost = {
        id: Date.now(),
        author: ADMIN_DATA.name,
        text: content,
        date: new Date().toLocaleDateString('vi-VN'),
        likes: 0
    };
    posts.unshift(newPost);
    localStorage.setItem('ptnn_database', JSON.stringify(posts));
}