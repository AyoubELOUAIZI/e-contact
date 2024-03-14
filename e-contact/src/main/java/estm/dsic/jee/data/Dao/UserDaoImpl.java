package estm.dsic.jee.data.Dao;

import estm.dsic.jee.models.User;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<User> getAllUsers() {
        return entityManager.createQuery("SELECT u FROM User u", User.class)
                .getResultList();
    }

    @Override
    @Transactional
    public User createUser(User user) {
        entityManager.persist(user);
        return user;
    }

    @Override
    public User getUserById(Long id) {
        return entityManager.find(User.class, id);
    }

    @Override
    @Transactional
    public User updateUser(Long id, User user) {
        User existingUser = entityManager.find(User.class, id);
        if (existingUser != null) {
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());
            existingUser.setAdmin(user.isAdmin());
            existingUser.setMaxContacts(user.getMaxContacts());
            // Set any other properties you want to update
            entityManager.merge(existingUser);
        }
        return existingUser;
    }

    @Override
    @Transactional
    public boolean deleteUser(Long id) {
        User user = entityManager.find(User.class, id);
        if (user != null) {
            entityManager.remove(user);
            return true; // Deletion successful
        }
        return false; // User with the given id not found
    }
}
