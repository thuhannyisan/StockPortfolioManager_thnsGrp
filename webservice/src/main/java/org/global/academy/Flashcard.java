package org.global.academy;

public class Flashcard {
    private String front;
    private String back;
    private boolean learned;

    // Constructor
    public Flashcard(String front, String back) {
        this.front = front;
        this.back = back;
        this.learned = false; // default: not learned yet
    }

    // Getters
    public String getFront() {
        return front;
    }

    public String getBack() {
        return back;
    }

    public boolean isLearned() {
        return learned;
    }

    // Setters
    public void setFront(String front) {
        this.front = front;
    }

    public void setBack(String back) {
        this.back = back;
    }

    public void setLearned(boolean learned) {
        this.learned = learned;
    }

    @Override
    public String toString() {
        return "Flashcard{" +
                "front='" + front + '\'' +
                ", back='" + back + '\'' +
                ", learned=" + learned +
                '}';
    }
}

