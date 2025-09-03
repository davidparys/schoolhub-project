// English translations for School Hub application

export default {
    // Common actions
    failed: 'Action failed',
    success: 'Action was successful',

    // Navigation
    nav: {
        students: 'Students',
        classes: 'Classes',
        language: 'Language',
        help: 'Help',
        navigation: 'Navigation'
    },

    // Students page
    students: {
        title: 'Students',
        subtitle: 'Manage {count} students',
        student: 'Student',
        addStudent: 'Add Student',
        firstName: 'First Name',
        lastName: 'Last Name',
        classes: 'Classes',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        assign: 'Assign to Class',
        noStudents: 'No students yet — click Add to create the first student.',
        noClasses: 'No classes assigned',
        noSearchResults: 'No students found matching your search.',
        searchPlaceholder: 'Search students...',
        confirmDelete: 'Remove student "{name}" from the system? This cannot be undone.',
        addTitle: 'Add New Student',
        editTitle: 'Edit Student',
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
        save: 'Save',
        cancel: 'Cancel'
    },

    // Classes page
    classes: {
        title: 'Classes',
        subtitle: 'Manage {count} classes',
        class: 'Class',
        addClass: 'Add Class',
        name: 'Name',
        description: 'Description',
        studentsCount: 'Students',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        viewDetails: 'View Details',
        assignStudents: 'Assign Students',
        noClasses: 'No classes yet — click Add to create the first class.',
        noDescription: 'No description',
        noSearchResults: 'No classes found matching your search.',
        searchPlaceholder: 'Search classes...',
        confirmDelete: 'Remove class "{name}" from the system? This cannot be undone.',
        addTitle: 'Add New Class',
        editTitle: 'Edit Class',
        nameRequired: 'Class name is required',
        save: 'Save',
        cancel: 'Cancel'
    },

    // Class detail page
    classDetail: {
        title: 'Class Details',
        loading: 'Loading class details...',
        notFound: 'Class Not Found',
        notFoundMessage: 'The requested class could not be found.',
        assignStudents: 'Assign Students',
        removeFromClass: 'Remove from Class',
        assignedStudents: 'Assigned Students',
        noStudentsAssigned: 'No students assigned to this class yet.',
        noOtherClasses: 'No other classes',
        otherClasses: 'Other Classes',
        backToClasses: 'Back to Classes',
        confirmRemove: 'Remove "{studentName}" from "{className}"? They will no longer be assigned to this class.'
    },

    // Assignment dialog
    assignment: {
        title: 'Assign Students to Class',
        classSubtitle: 'Assigning students to {name}',
        studentSubtitle: 'Assigning {name} to classes',
        availableStudents: 'Available Students',
        assignedStudents: 'Assigned Students',
        noAvailableStudents: 'All students are assigned',
        noAssignedStudents: 'No students assigned',
        addSelected: 'Add Selected',
        removeSelected: 'Remove Selected',
        assignAll: 'Assign All',
        clear: 'Clear All',
        save: 'Save Changes',
        cancel: 'Cancel',
        searchPlaceholder: 'Search students...'
    },

    // Form validation
    validation: {
        required: 'This field is required',
        maxLength: 'Maximum {max} characters allowed',
        minLength: 'Minimum {min} characters required'
    },

    // Toast messages
    toast: {
        studentAdded: 'Student added successfully',
        studentUpdated: 'Student updated successfully',
        studentDeleted: 'Student deleted successfully',
        studentRemovedFromClass: 'Student removed from class',
        classAdded: 'Class added successfully',
        classUpdated: 'Class updated successfully',
        classDeleted: 'Class deleted successfully',
        classAssignmentsUpdated: 'Class assignments updated successfully, {added} added, {removed} removed',
        studentsAssigned: '{count} students assigned to class',
        studentsRemoved: '{count} students removed from class',
        assignmentsSaved: 'Assignments saved successfully',
        error: 'An error occurred',
        loadError: 'Failed to load data'
    }
};
