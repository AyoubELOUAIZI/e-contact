package estm.dsic.jee.data.Dao;

import estm.dsic.jee.models.User;

import jakarta.enterprise.context.SessionScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.io.Serializable;
import java.util.List;

@Transactional
@SessionScoped
public class UserDaoImpl implements UserDao , Serializable {

    @PersistenceContext(unitName = "e_contact")
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

    @Override
    public User getUserByEmailAndPassword(String email, String password) {
        TypedQuery<User> query = entityManager
                .createQuery("SELECT u FROM User u WHERE u.email = :email AND u.password = :password", User.class);
        query.setParameter("email", email);
        query.setParameter("password", password);
        List<User> users = query.getResultList();
        return users.isEmpty() ? null : users.get(0);
    }
}
