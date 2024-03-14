package estm.dsic.jee.services;

import estm.dsic.jee.models.User;
import estm.dsic.jee.data.Dao.UserDao;

import jakarta.inject.Inject;
import java.util.List;

public class UserServiceImpl implements UserService {
    @Inject
    private UserDao userDao;

    @Override
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    @Override
    public User createUser(User user) {
        return userDao.createUser(user);
    }

    @Override
    public User getUserById(Long id) {
        return userDao.getUserById(id);
    }

    @Override
    public User updateUser(Long id, User user) {
        return userDao.updateUser(id, user);
    }

    @Override
    public boolean deleteUser(Long id) {
       return userDao.deleteUser(id);
    }
}
