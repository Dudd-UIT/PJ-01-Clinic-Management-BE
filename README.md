# Đồ án môn học SE104 và IS210
## Tổng quan
* Tên đề tài: Quản lý Phòng mạch tư
* GVHD: 
    * TS. Đỗ Thị Thanh Tuyền
    * ThS. Đỗ Thị Minh Phụng
* Thành viên nhóm và phân công
    * Ngô Hương Giang - 22520357
    * Đoàn Danh Dự - 22520260
    * Nguyễn Xuân Quang - 22521205
    * Lê Duy Nguyên - 22520971

| Công việc | 22520357 | 22520260 | 22521205 | 22520971 |
| --- | :---: | :---: | :---: | :---: |
| Giới thiệu bài toán cần giải quyết và mô tả quy trình thực hiện các công việc chính. | x |  | x | x |
| Xác định và mô hình hóa yêu cầu phần mềm | x | x | x | x |
| Thiết kế hệ thống | x | x |  | x |
| Thiết kế dữ liệu |  |  | x | x |
| Thiết kế giao diện | x | x | x |  |
| Cài đặt |  | x | x | x |
| Kiểm chứng | x |  | x |  |
| Hosting ứng dụng lên Oracle Cloud | x |  | x |  |
| Xây dựng hệ thống phân quyền người dùng |  | x |  | x |
| Xây dựng thêm các tính năng mới | x | x |  | x |
| **Mức độ hoàn thành các công việc được phân công (%)** | **100** | **100** | **100** | **100** |
| **Mức độ đóng góp cho kết quả của đồ án (tổng cộng = 100%)** | **25** | **25** | **25** | **25** |

## Cài đặt và thử nghiệm
### Môi trường và công nghệ sử dụng
* Môi trường sử dụng: người dùng có thể truy cập vào ứng dụng web thông qua các trình duyệt như Google Chrome, Microsoft Edge,…
* Cần có kết nối Internet để truy cập vào ứng dụng web và gửi các yêu cầu đến server và cơ sở dữ liệu.
* Môi trường phát triển: ReactJS, NodeJS. Hệ quản trị cơ sở dữ liệu Oracle. 
* Thiết kế giao diện : Figma.
* Quản lý mã nguồn: Git, GitHub.
* Xử lý thời gian thực: Socket.io
* Xác thực và phân quyền: Json Web Token (JWT)
* Hosting server: Oracle Cloud.
### Chức năng 
| STT | Chức năng | Mức độ hoàn thành | Ghi chú |
| --- | --- | :---: | --- |
| 1 | Lập danh sách khám bệnh | 100% | Gồm trang danh sách đăng kí cho lễ tân và danh sách khám bệnh cho bác sĩ. |
| 2 | Lập phiếu khám bệnh | 100% | Gồm trang thông tin khám cho bác sĩ thêm các mô tả cũng như kết luận bệnh, và trang đơn thuốc để bác sĩ thực hiện kê đơn thuốc cho bệnh nhân. |
| 3 | Tra cứu bệnh nhân | 100% | Trang khách hàng để lễ tân có thể tra cứu thông tin hồ sơ cũng như các lịch sử khám của tất cả các bệnh nhân đã từng khám tại phòng khám. Ngoài ra, trang danh sách đăng kí và danh sách khám bệnh giúp bác sĩ và lễ tân tra cứu các phiếu khám của các bệnh nhân. |
| 4 | Lập hóa đơn thanh toán | 100% | Màn hình hóa đơn thanh toán tương ứng với các phiếu khám cho phép lễ tân xem thông tin hóa đơn và thực hiện thanh toán cho bệnh nhân. |
| 5 | Lập báo cáo thống kê theo tháng hoặc năm | 100% | Người lễ tân có thể xem báo cáo thống kê ở dạng biểu đồ hay dạng danh sách số liệu theo các tiêu chí: Thống kê doanh thu, tần suất khám của bệnh nhân, các dịch vụ đã được thực hiện, các loại bệnh đã xuất hiện ở bệnh nhân, các loại thuốc đã bán. |
| 6 | Thay đổi các quy định | 100% | Người quản trị có thể thay đổi các quy định của phòng khám như số lượt khám tối đa trong ngày, danh sách các nhóm người dùng, danh sách các dịch vụ, danh sách các loại dịch vụ, danh sách các thuốc, danh sách các đơn vị thuốc, danh sách các loại bệnh. |
| 7 | Quản lý kho thuốc | 100% | Người quản lý kho thuốc có thể thêm, sửa, xóa các lô thuốc nhập vào. Ngoài ra, hệ thống còn tự động kiểm tra và thông báo cho người quản kho biết thuốc nào đang hết hàng. |
| 8 | Quản lý danh sách tài khoản | 100% | Người quản trị có thể thêm, sửa thông tin, xóa người dùng của hệ thống như bác sĩ, lễ tân, người quản kho, v.v. |
| 9 | Phân quyền nhóm người dùng | 100% | Người quản trị có thể thực hiện phân quyền truy cập các tài nguyên cho các nhóm người dùng. |

### Truy cập
* Ứng dụng web có thể truy cập dễ dàng thông qua link: http://152.69.209.236/
* Mã nguồn frontend: https://github.com/22520260/QLPM-Frontend
* Mã nguồn backend: https://github.com/22520260/QLPM-Backend
