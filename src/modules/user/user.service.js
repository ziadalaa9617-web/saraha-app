const fs = require('fs/promises');
const path = require('path');
const AppError = require('../../pkg/AppError');
const { detect } = require('../../pkg/fileType');

const UPLOADS = path.join(__dirname, '../../../uploads');

const createUserService = ({ userRepo }) => {
  const uploadAvatar = async (user, file) => {
    if (!file) throw new AppError('image is required', 400);
    const type = detect(file.buffer);
    if (!type) throw new AppError('invalid image file', 400);

    const name = `${user._id}-${Date.now()}.${type.ext}`;
    await fs.writeFile(path.join(UPLOADS, name), file.buffer);
    if (user.avatar) await fs.unlink(path.join(UPLOADS, user.avatar)).catch(() => {});
    await userRepo.updateById(user._id, { avatar: name });
    return { avatar: `/uploads/${name}` };
  };

  return { uploadAvatar };
};

module.exports = createUserService;