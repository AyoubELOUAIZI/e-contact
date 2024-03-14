package estm.dsic.jee.data.Dao;

import estm.dsic.jee.models.Contact;

import java.util.List;

public interface ContactDao {
    List<Contact> getAllContactsByUserId(Long userId);
    Contact createContact(Contact contact);
    Contact updateContact(Long id, Contact contact);
    boolean deleteContact(Long id);
}
