package estm.dsic.jee.services;

import estm.dsic.jee.models.User;
import estm.dsic.jee.data.Dao.UserDao;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;

import java.io.Serializable;
import java.util.List;

@SessionScoped
public class UserServiceImpl implements UserService, Serializable {
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

    @Override
    public User signInUser(String email, String password) {
        return userDao.getUserByEmailAndPassword(email, password);
    }

    @Override
    public List<User> searchUsersByKeyword(String keyword) {
        return userDao.searchUsersByKeyword(keyword);
    }

    @Override
    public boolean subscribeUser(Long adminId, Long userId) {
        User adminUser = userDao.getUserById(adminId);
        if (adminUser != null && adminUser.isAdmin()) {
            User userToSubscribe = userDao.getUserById(userId);
            if (userToSubscribe != null) {
                userToSubscribe.setSubscribed(true);
                userDao.updateUser(userId, userToSubscribe);
                return true; // Successfully subscribed
            }
        }
        return false; // Admin not found or user not found
    }

}
