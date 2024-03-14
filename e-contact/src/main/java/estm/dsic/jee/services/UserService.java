package estm.dsic.jee.services;

import estm.dsic.jee.models.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User createUser(User user);
    User getUserById(Long id);
    User updateUser(Long id, User user);
    boolean deleteUser(Long id);
    User signInUser(String email, String password);

}
