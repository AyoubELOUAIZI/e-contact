package estm.dsic.jee.services;

import estm.dsic.jee.models.Contact;
import estm.dsic.jee.data.Dao.ContactDao;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;

import java.io.Serializable;
import java.util.List;


@SessionScoped
public class ContactServiceImpl implements ContactService,Serializable {
    @Inject
    private ContactDao contactDao;

    @Override
    public List<Contact> getAllContactsByOwnerId(Long userId) {
        return contactDao.getAllContactsByUserId(userId);
    }

    @Override
    public Contact createContact(Contact contact) {
        return contactDao.createContact(contact);
    }

    @Override
    public Contact updateContact(Long id, Contact contact) {
        return contactDao.updateContact(id, contact);
    }

    @Override
    public boolean deleteContact(Long id) {
        return contactDao.deleteContact(id);
    }

    @Override
    public List<Contact> searchContactsByKeyword(String keyword) {
        return contactDao.searchContactsByKeyword(keyword);
    }

}
