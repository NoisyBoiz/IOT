import Users from "../models/users.js"
import Patients from "../models/patients.js"
import Doctors from "../models/doctors.js"

export const login = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) return res.status(400).json({message: 'Vui lòng điền đầy đủ thông tin.'});
    try {
      const user = await Users.findOne({ username });
      if (!user) 
        return res.status(400).json({ message: 'Tên đăng nhập không tồn tại.' });

      if (user.password !== password) 
        return res.status(400).json({ message: 'Mật khẩu không đúng.' });

      let info;
      if(user.role == "patient"){
        info = await Patients.findById(user._id).populate({path: 'user', select: '-_id -password -__v'}).select('-__v');
        if (!info) return res.status(404).json({ message: 'Bệnh nhân không tồn tại.'});
      }

      else if(user.role == "doctor"){
        info = await Doctors.findById(user._id).populate({path: 'user', select: '-_id -password -__v'}).select('-__v');
        if (!info) return res.status(404).json({ message: 'Bác sĩ không tồn tại.'});
      }

      res.status(200).json({message: 'Đăng nhập thành công', info});
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Lỗi máy chủ'});
    }
  };
  

export const register = async (req, res) => {
    const { fullname, username, password, role } = req.body;
    if (!fullname || !username || !password || !role) 
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });

    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) 
        return res.status(400).json({ message: 'Tên đăng nhập không hợp lệ. Phải chứa ít nhất 3 ký tự và chỉ bao gồm chữ cái và số.'});

    // if (password.length < 6) 
    //     return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });

    if (!['patient', 'doctor'].includes(role)) 
        return res.status(400).json({ message: 'Vai trò không hợp lệ. Chọn "patient" hoặc "doctor".' });

    try {
        const existingUser = await Users.findOne({ username });
        if (existingUser) 
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại.' });
    
        const newUser = new Users({ fullname, username, password, role });

        if (role === 'patient') {
            const newPatient = new Patients({_id: newUser._id, user: newUser._id});
            await newPatient.save();
        } 
        else if (role === 'doctor') {
            const newDoctor = new Doctors({_id: newUser._id, user: newUser._id});
            await newDoctor.save();
        }

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký người dùng thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
  

