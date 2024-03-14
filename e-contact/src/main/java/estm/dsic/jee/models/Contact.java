package estm.dsic.jee.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "Contact")
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for the contact

    @Column(nullable = false)
    private String nom; // Name of the contact

    @Pattern(regexp = "\\d{10}", message = "Invalid telephone number format") // Adjust the regex pattern as needed
    @Column(nullable = false)
    private String tele; // Telephone number of the contact

    @Email(message = "Invalid email format")
    @Column(nullable = false)
    private String email; // Email address of the contact

    @Column(nullable = false)
    private String adresse; // Address of the contact

    // @ManyToOne
    // @JoinColumn(name = "user_id", nullable = false)
    // private User user; // User to whom this contact belongs

    @ManyToOne(fetch = FetchType.LAZY) // Use lazy loading for the user association //this is because I want to only
                                       // fetch the user_id with the contact without the all user object
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getTele() {
        return tele;
    }

    public void setTele(String tele) {
        this.tele = tele;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Getters and setters
    
}
