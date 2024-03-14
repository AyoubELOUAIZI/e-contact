package estm.dsic.jee.data.Dao;

import estm.dsic.jee.models.User;

import java.util.List;

public interface UserDao {
    List<User> getAllUsers();
    User createUser(User user);
    User getUserById(Long id);
    User updateUser(Long id, User user);
    boolean deleteUser(Long id);
    User getUserByEmailAndPassword(String email, String password);

}
