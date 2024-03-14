package estm.dsic.jee.data.Dao;

import estm.dsic.jee.models.Contact;

import jakarta.enterprise.context.SessionScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.io.Serializable;
import java.util.List;


@Transactional
@SessionScoped
public class ContactDaoImpl implements ContactDao, Serializable {

    @PersistenceContext(unitName = "e_contact")
    private EntityManager entityManager;

    @Override
    public List<Contact> getAllContactsByUserId(Long userId) {
        return entityManager.createQuery(
                "SELECT c FROM Contact c WHERE c.user.id = :userId", Contact.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    @Transactional
    public Contact createContact(Contact contact) {
        entityManager.persist(contact);
        return contact;
    }

    @Override
    @Transactional
    public Contact updateContact(Long id, Contact contact) {
        Contact existingContact = entityManager.find(Contact.class, id);
        if (existingContact != null) {
            existingContact.setNom(contact.getNom());
            existingContact.setTele(contact.getTele());
            existingContact.setEmail(contact.getEmail());
            existingContact.setAdresse(contact.getAdresse());
            // Set any other properties you want to update
            entityManager.merge(existingContact);
        }
        return existingContact;
    }

    @Override
    @Transactional
    public boolean deleteContact(Long id) {
        Contact contact = entityManager.find(Contact.class, id);
        if (contact != null) {
            entityManager.remove(contact);
            return true; // Deletion successful
        }
        return false; // Contact with the given id not found
    }

}
