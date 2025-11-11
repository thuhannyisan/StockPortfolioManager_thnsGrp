package Labs.Lab08;

import java.io.Serializable;
class Student implements Serializable {
    private static final long serialVersionUID = 1L; //not totally necessary but good practice
    String name;
    int id;   
    public Student(String name, int id) {
        this.name = name;
        this.id = id;
    }
}

