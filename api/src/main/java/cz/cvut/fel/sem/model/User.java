package cz.cvut.fel.sem.model;

import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;

@Entity
// We can't name the table User, as it is a reserved table name in some dbs, including Postgres
@Table(name = "USER_TABLE")
@NamedQueries({
    @NamedQuery(name = "User.findByEmail", query = "SELECT u FROM User u WHERE u.email = :email")
})
public class User extends AbstractEntity {

    @Basic(optional = false)
    @Column(nullable = false, unique = true)
    private String email;

    @Basic(optional = false)
    @Column(nullable = false)
    private String password;

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

    public void encodePassword(PasswordEncoder passwordEncoder){
        this.password = passwordEncoder.encode(this.password);
    }

    @Override
    public String toString() {
        return "User{" +
                email + "}";
    }
}
