package demo.domain;

import javax.persistence.*;

/**
 * Date: 02.02.2015
 * Time: 12:19
 *
 */
@Entity
public class Participant {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;

    @Column(unique=true)
    private String name;

    private int counts = 0;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void addOne() {
        this.counts++;
    }

    @Override
    public String toString() {
        return "Participant{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
