import { defineStore } from 'pinia';
import { ref, readonly } from 'vue';

export const useUiStore = defineStore('ui', () => {
    // State
    const isLoading = ref(false);
    const showStudentDialog = ref(false);
    const showClassDialog = ref(false);
    const showAssignDialog = ref(false);
    const selectedClassId = ref<string | undefined>(undefined);
    const selectedStudentIds = ref<string[]>([]);
    const language = ref<'en' | 'pl'>('en');
    const toastMessage = ref<string>('');
    const toastType = ref<'positive' | 'negative' | 'warning' | 'info'>('info');
    const showToast = ref(false);

    // Actions for dialogs
    function openStudentDialog() {
        showStudentDialog.value = true;
    }

    function closeStudentDialog() {
        showStudentDialog.value = false;
    }

    function openClassDialog() {
        showClassDialog.value = true;
    }

    function closeClassDialog() {
        showClassDialog.value = false;
    }

    function openAssignDialog(classId?: string) {
        selectedClassId.value = classId;
        showAssignDialog.value = true;
    }

    function closeAssignDialog() {
        showAssignDialog.value = false;
        selectedClassId.value = undefined;
        selectedStudentIds.value = [];
    }

    // Actions for student selection
    function selectStudent(studentId: string) {
        if (!selectedStudentIds.value.includes(studentId)) {
            selectedStudentIds.value.push(studentId);
        }
    }

    function unselectStudent(studentId: string) {
        selectedStudentIds.value = selectedStudentIds.value.filter(id => id !== studentId);
    }

    function toggleStudentSelection(studentId: string) {
        if (selectedStudentIds.value.includes(studentId)) {
            unselectStudent(studentId);
        } else {
            selectStudent(studentId);
        }
    }

    function selectAllStudents(studentIds: string[]) {
        selectedStudentIds.value = [...studentIds];
    }

    function clearStudentSelection() {
        selectedStudentIds.value = [];
    }

    // Language management
    function setLanguage(lang: 'en' | 'pl') {
        language.value = lang;
        localStorage.setItem('schoolhub-language', lang);
    }

    function loadLanguageFromStorage() {
        const saved = localStorage.getItem('schoolhub-language');
        if (saved && (saved === 'en' || saved === 'pl')) {
            language.value = saved;
        }
    }

    // Toast notifications
    function showNotification(message: string, type: 'positive' | 'negative' | 'warning' | 'info' = 'info') {
        toastMessage.value = message;
        toastType.value = type;
        showToast.value = true;
    }

    function hideNotification() {
        showToast.value = false;
        toastMessage.value = '';
    }

    // Loading state
    function setLoading(loading: boolean) {
        isLoading.value = loading;
    }

    return {
        // State
        isLoading: readonly(isLoading),
        showStudentDialog: readonly(showStudentDialog),
        showClassDialog: readonly(showClassDialog),
        showAssignDialog: readonly(showAssignDialog),
        selectedClassId: readonly(selectedClassId),
        selectedStudentIds: readonly(selectedStudentIds),
        language: readonly(language),
        toastMessage: readonly(toastMessage),
        toastType: readonly(toastType),
        showToast: readonly(showToast),

        // Dialog actions
        openStudentDialog,
        closeStudentDialog,
        openClassDialog,
        closeClassDialog,
        openAssignDialog,
        closeAssignDialog,

        // Selection actions
        selectStudent,
        unselectStudent,
        toggleStudentSelection,
        selectAllStudents,
        clearStudentSelection,

        // Language actions
        setLanguage,
        loadLanguageFromStorage,

        // Toast actions
        showNotification,
        hideNotification,

        // Loading actions
        setLoading
    };
});
