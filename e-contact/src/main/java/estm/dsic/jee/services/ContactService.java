package estm.dsic.jee.services;

import estm.dsic.jee.models.Contact;

import java.util.List;

public interface ContactService {
    List<Contact> getAllContactsByOwnerId(Long userId);
    Contact createContact(Contact contact);
    Contact updateContact(Long id, Contact contact);
    boolean deleteContact(Long id);
    List<Contact> searchContactsByKeyword(String keyword);

}
