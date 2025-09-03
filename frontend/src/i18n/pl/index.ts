// Polish translations for School Hub application

export default {
    // Common actions
    failed: 'Akcja nie powiodła się',
    success: 'Akcja zakończona pomyślnie',

    // Navigation
    nav: {
        students: 'Uczniowie',
        classes: 'Klasy',
        language: 'Język',
        help: 'Pomoc',
        navigation: 'Nawigacja'
    },

    // Students page
    students: {
        title: 'Uczniowie',
        student: 'Uczeń',
        addStudent: 'Dodaj Ucznia',
        subtitle: 'Zarządzaj {count} uczniami',
        firstName: 'Imię',
        lastName: 'Nazwisko',
        classes: 'Klasy',
        actions: 'Akcje',
        edit: 'Edytuj',
        delete: 'Usuń',
        assign: 'Przypisz do Klasy',
        noStudents: 'Brak uczniów — kliknij Dodaj, aby utworzyć pierwszego ucznia.',
        noClasses: 'Brak przypisanych klas',
        noSearchResults: 'Nie znaleziono uczniów pasujących do wyszukiwania.',
        searchPlaceholder: 'Szukaj uczniów...',
        confirmDelete: 'Usunąć ucznia "{name}" z systemu? Tej operacji nie można cofnąć.',
        addTitle: 'Dodaj Nowego Ucznia',
        editTitle: 'Edytuj Ucznia',
        firstNameRequired: 'Imię jest wymagane',
        lastNameRequired: 'Nazwisko jest wymagane',
        save: 'Zapisz',
        cancel: 'Anuluj'
    },

    // Classes page
    classes: {
        title: 'Klasy',
        class: 'Klasa',
        addClass: 'Dodaj Klasę',
        subtitle: 'Zarządzaj {count} klasami',
        name: 'Nazwa',
        description: 'Opis',
        studentsCount: 'Uczniowie',
        actions: 'Akcje',
        edit: 'Edytuj',
        delete: 'Usuń',
        viewDetails: 'Zobacz Szczegóły',
        assignStudents: 'Przypisz Uczniów',
        noClasses: 'Brak klas — kliknij Dodaj, aby utworzyć pierwszą klasę.',
        noDescription: 'Brak opisu',
        noSearchResults: 'Nie znaleziono klas pasujących do wyszukiwania.',
        searchPlaceholder: 'Szukaj klas...',
        confirmDelete: 'Usunąć klasę "{name}" z systemu? Tej operacji nie można cofnąć.',
        addTitle: 'Dodaj Nową Klasę',
        editTitle: 'Edytuj Klasę',
        nameRequired: 'Nazwa klasy jest wymagana',
        save: 'Zapisz',
        cancel: 'Anuluj'
    },

    // Class detail page
    classDetail: {
        title: 'Szczegóły Klasy',
        assignStudents: 'Przypisz Uczniów',
        removeFromClass: 'Usuń z Klasy',
        assignedStudents: 'Przypisani Uczniowie',
        noStudentsAssigned: 'Żaden uczeń nie jest jeszcze przypisany do tej klasy.',
        backToClasses: 'Powrót do Klas'
    },

    // Assignment dialog
    assignment: {
        title: 'Przypisz Uczniów do Klasy',
        classSubtitle: 'Przypisz {name} do klas',
        studentSubtitle: 'Przypisz {name} do klas',
        availableStudents: 'Dostępni Uczniowie',
        assignedStudents: 'Przypisani Uczniowie',
        noAvailableStudents: 'Wszystkie uczniowie są przypisani',
        noAssignedStudents: 'Żaden uczeń nie jest przypisany',
        addSelected: 'Dodaj Zaznaczonych',
        removeSelected: 'Usuń Zaznaczonych',
        assignAll: 'Przypisz Wszystkich',
        clear: 'Wyczyść Wszystko',
        save: 'Zapisz Zmiany',
        cancel: 'Anuluj',
        searchPlaceholder: 'Szukaj uczniów...'
    },

    // Form validation
    validation: {
        required: 'To pole jest wymagane',
        maxLength: 'Maksymalnie {max} znaków dozwolone',
        minLength: 'Minimum {min} znaków wymagane'
    },

    // Toast messages
    toast: {
        studentAdded: 'Uczeń został dodany pomyślnie',
        studentUpdated: 'Uczeń został zaktualizowany pomyślnie',
        studentDeleted: 'Uczeń został usunięty pomyślnie',
        studentRemovedFromClass: 'Uczeń został usunięty z klasy',
        classAdded: 'Klasa została dodana pomyślnie',
        classUpdated: 'Klasa została zaktualizowana pomyślnie',
        classDeleted: 'Klasa została usunięta pomyślnie',
        studentsAssigned: '{count} uczniów przypisano do klasy',
        studentsRemoved: '{count} uczniów usunięto z klasy',
        classAssignmentsUpdated: 'Zmiany w przypisaniu uczniów do klasy zostały zapisane pomyślnie, {added} dodano, {removed} usunięto',
        assignmentsSaved: 'Zmiany zostały zapisane pomyślnie',
        error: 'Wystąpił błąd',
        loadError: 'Nie udało się załadować danych'
    }
};
