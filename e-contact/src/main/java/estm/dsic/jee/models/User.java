package estm.dsic.jee.models;

import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "User")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for the user

    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email; // Email address of the user

    @Size(min = 6, message = "Password must be at least 6 characters long")
    @Column(nullable = false)
    private String password; // Password of the user

    @Column(nullable = false)
    private boolean isAdmin; // Flag indicating whether the user is an administrator or not

    @Column(nullable = false)
    private boolean isSubscribed; // Flag indicating whether the user is verified as a subscriber 
    
    @Column(name = "max_contacts", nullable = false)
    private int maxContacts; // Max number of contacts a user can have

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Contact> contacts; // List of contacts associated with this user

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public int getMaxContacts() {
        return maxContacts;
    }

    public void setMaxContacts(int maxContacts) {
        this.maxContacts = maxContacts;
    }

    public List<Contact> getContacts() {
        return contacts;
    }

    public void setContacts(List<Contact> contacts) {
        this.contacts = contacts;
    }

    // PrePersist method to set default values or perform operations before
    // persisting the entity
    @PrePersist
    protected void onCreate() {
        // Perform any pre-persist operations here
        // Example: Set default values or initialize fields
        if (!this.isAdmin) {
            this.isAdmin = false; // Ensure isAdmin is set to false if not provided
        }

        if (this.maxContacts <= 0) {
            this.maxContacts = 5; // Set maxContacts to 5 if not provided or invalid
        }

        if (!this.isSubscribed) {
            this.isSubscribed = false; // Ensure isSubscribed is set to false if not provided
        }
    }

}
