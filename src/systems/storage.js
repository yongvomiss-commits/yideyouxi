class Storage {
    static saveData(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}