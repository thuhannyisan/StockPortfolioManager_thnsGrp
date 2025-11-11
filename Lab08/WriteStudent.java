package Labs.Lab08;

import com.google.gson.Gson;
import java.io.FileWriter;
import java.io.IOException;
public class WriteStudent {
    public static void main(String[] args) {
        StudentJ s = new StudentJ("Alice", 123);
        Gson gson = new Gson();
        try (FileWriter writer = new FileWriter("student.json")) {
            gson.toJson(s, writer);
            System.out.println("Saved to student.json");
        } catch (IOException e) {
            e.printStackTrace();
    }}}

