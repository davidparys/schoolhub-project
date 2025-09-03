<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStudents } from '../composables/useStudents';
import { useClasses } from '../composables/useClasses';
import { useStudentsStore } from '../stores/students';
import { useClassesStore } from '../stores/classes';
import { useUiStore } from '../stores/ui';
import type { Student, Class } from '../components/models';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t } = useI18n();
const studentsStore = useStudentsStore();
const classesStore = useClassesStore();
const uiStore = useUiStore();

// Pinia Colada composables
const { data: students } = useStudents();
const { data: classes } = useClasses();


// Component props
const props = defineProps<{
    id: string;
}>();

// Reactive data
const isLoading = ref(true);
const searchQuery = ref('');
const studentSearchQuery = ref('');
const activeTab = ref('available');
const showEditDialog = ref(false);
const showRemoveDialog = ref(false);
const showDeleteDialog = ref(false);
const studentToRemove = ref<Student | null>(null);

const classForm = ref({
    name: '',
    description: ''
});

// Computed properties
const currentClass = computed(() => {
    if (!classes.value) return undefined;
    return classes.value.find(cls => cls.id === props.id);
});

const assignedStudents = computed(() => {
    if (!currentClass.value || !students.value) return [];
    return students.value.filter(student => student.classIds.includes(currentClass.value!.id));
});

const filteredStudents = computed(() => {
    if (!searchQuery.value) return assignedStudents.value;

    const query = searchQuery.value.toLowerCase();
    return assignedStudents.value.filter(student =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query)
    );
});

const availableStudents = computed(() => {
    if (!currentClass.value || !students.value) return [];

    const assigned = assignedStudents.value.map(s => s.id);
    let available = students.value.filter(s => !assigned.includes(s.id));

    if (studentSearchQuery.value) {
        const query = studentSearchQuery.value.toLowerCase();
        available = available.filter(s =>
            s.firstName.toLowerCase().includes(query) ||
            s.lastName.toLowerCase().includes(query)
        );
    }

    return available;
});

// Table columns
const columns = computed(() => [
    {
        name: 'firstName',
        label: t('students.firstName'),
        field: 'firstName',
        align: 'left' as const,
        sortable: true
    },
    {
        name: 'lastName',
        label: t('students.lastName'),
        field: 'lastName',
        align: 'left' as const,
        sortable: true
    },
    {
        name: 'otherClasses',
        label: t('classDetail.otherClasses'),
        field: 'otherClasses',
        align: 'left' as const
    },
    {
        name: 'actions',
        label: t('students.actions'),
        field: 'actions',
        align: 'right' as const
    }
]);

// Helper functions
function getOtherClasses(studentId: string): Class[] {
    if (!students.value || !classes.value || !currentClass.value) return [];

    const student = students.value.find(s => s.id === studentId);
    if (!student) return [];

    return student.classIds
        .filter(classId => classId !== currentClass.value!.id)
        .map(classId => classes.value?.find(cls => cls.id === classId))
        .filter(cls => cls !== undefined);
}

// Dialog functions
function openAssignDialog() {
    studentSearchQuery.value = '';
    uiStore.clearStudentSelection();
    uiStore.openAssignDialog(currentClass.value?.id);
}

function closeAssignDialog() {
    studentSearchQuery.value = '';
    uiStore.clearStudentSelection();
    uiStore.closeAssignDialog();
}

function editClass() {
    if (!currentClass.value) return;

    classForm.value = {
        name: currentClass.value.name,
        description: currentClass.value.description || ''
    };
    showEditDialog.value = true;
}

function editStudent(student: Student) {
    // Navigate to students page or open edit dialog
    void router.push('/students');
    // TODO: Could pass student ID as query param to open edit dialog
    console.log('Editing student:', student.id);
}

function confirmRemoveStudent(student: Student) {
    studentToRemove.value = student;
    showRemoveDialog.value = true;
}

function confirmDeleteClass() {
    showDeleteDialog.value = true;
}

// CRUD operations
async function saveClass() {
    if (!currentClass.value || !classForm.value.name.trim()) {
        return;
    }

    isLoading.value = true;
    try {
        await classesStore.editClass(currentClass.value.id, {
            name: classForm.value.name.trim(),
            description: classForm.value.description.trim() || undefined
        });

        uiStore.showNotification('Class updated successfully', 'positive');
        showEditDialog.value = false;
    } catch (error) {
        console.error('Error updating class:', error);
        uiStore.showNotification('Error updating class', 'negative');
    } finally {
        isLoading.value = false;
    }
}

async function removeStudent() {
    if (!studentToRemove.value || !currentClass.value) return;

    isLoading.value = true;
    try {
        await studentsStore.removeFromClass(studentToRemove.value.id, currentClass.value.id);
        uiStore.showNotification('Student removed from class', 'positive');
        showRemoveDialog.value = false;
        studentToRemove.value = null;
    } catch (error) {
        console.error('Error removing student:', error);
        uiStore.showNotification('Error removing student', 'negative');
    } finally {
        isLoading.value = false;
    }
}

async function deleteClass() {
    if (!currentClass.value) return;

    isLoading.value = true;
    try {
        // Remove class from all students first
        await Promise.all(assignedStudents.value.map(student =>
            studentsStore.removeFromClass(student.id, currentClass.value!.id)
        ));

        // Then delete the class
        await classesStore.removeClass(currentClass.value.id);
        uiStore.showNotification('Class deleted successfully', 'positive');

        // Navigate back to classes page
        void router.push('/classes');
    } catch (error) {
        console.error('Error deleting class:', error);
        uiStore.showNotification('Error deleting class', 'negative');
    } finally {
        isLoading.value = false;
    }
}

// Assignment functions
function toggleStudentSelection(student: Student) {
    uiStore.toggleStudentSelection(student.id);
}

function removeStudentFromClass(student: Student) {
    if (currentClass.value) {
        void studentsStore.removeFromClass(student.id, currentClass.value.id);
    }
}

function assignSelectedStudents() {
    if (currentClass.value && uiStore.selectedStudentIds.length > 0) {
        void studentsStore.assignMultipleToClass([...uiStore.selectedStudentIds], currentClass.value.id);
        uiStore.clearStudentSelection();
    }
}

function assignAllStudents() {
    if (currentClass.value && availableStudents.value.length > 0) {
        const studentIds = availableStudents.value.map(s => s.id);
        void studentsStore.assignMultipleToClass(studentIds, currentClass.value.id);
    }
}

function clearAllAssignments() {
    if (currentClass.value && assignedStudents.value.length > 0) {
        const studentIds = assignedStudents.value.map(s => s.id);
        void studentsStore.removeMultipleFromClass(studentIds, currentClass.value.id);
    }
}

function saveAssignments() {
    closeAssignDialog();
    uiStore.showNotification('Assignments saved successfully', 'positive');
}

// Initialize data
onMounted(() => {
    // Data will be automatically loaded via Pinia Colada useQuery
    // Mock data initialization is handled by the stores if needed
    isLoading.value = false;
});

// Watch for route changes
watch(() => props.id, () => {
    if (!currentClass.value) {
        // Class not found, will show error state
        isLoading.value = false;
    }
});
</script>

<template>
    <q-page class="q-pa-lg">
        <div class="constrain-more">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center q-py-xl">
                <q-spinner-dots size="50px" color="primary" />
                <p class="text-body1 q-mt-md">{{ $t('classDetail.loading') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="!currentClass" class="text-center q-py-xl">
                <q-icon name="error_outline" size="64px" color="negative" class="q-mb-md" />
                <h2 class="text-h4 q-mb-md">{{ $t('classDetail.notFound') }}</h2>
                <p class="text-body1 text-grey-7 q-mb-lg">{{ $t('classDetail.notFoundMessage') }}</p>
                <q-btn color="primary" :label="$t('classDetail.backToClasses')" icon="arrow_back"
                    @click="$router.push('/classes')" />
            </div>

            <!-- Main Content -->
            <div v-else>
                <!-- Header with breadcrumb -->
                <div class="row items-center q-mb-lg">
                    <q-btn flat round icon="arrow_back" color="grey-7" @click="$router.push('/classes')"
                        class="q-mr-md">
                        <q-tooltip>{{ $t('classDetail.backToClasses') }}</q-tooltip>
                    </q-btn>
                    <div>
                        <q-breadcrumbs class="text-grey-7 q-mb-xs">
                            <q-breadcrumbs-el :label="$t('nav.classes')" @click="$router.push('/classes')" />
                            <q-breadcrumbs-el :label="currentClass.name" />
                        </q-breadcrumbs>
                        <h1 class="text-h2 q-ma-none">{{ currentClass.name }}</h1>
                        <p v-if="currentClass.description" class="text-body1 text-grey-7 q-mt-sm">
                            {{ currentClass.description }}
                        </p>
                    </div>
                </div>

                <!-- Class Actions -->
                <div class="class-actions q-mb-xl">
                    <!-- Mobile: Stack buttons vertically -->
                    <div v-if="$q.screen.lt.sm" class="column q-gutter-sm">
                        <q-btn color="primary" :label="$t('classDetail.assignStudents')" icon="people"
                            @click="openAssignDialog" />
                        <q-btn outline color="grey-7" :label="$t('classes.edit')" icon="edit" @click="editClass" />
                        <q-btn outline color="negative" :label="$t('classes.delete')" icon="delete"
                            @click="confirmDeleteClass" />
                    </div>

                    <!-- Desktop/Tablet: Row layout -->
                    <div v-else class="row q-gutter-sm">
                        <q-btn color="primary" :label="$t('classDetail.assignStudents')" icon="people"
                            @click="openAssignDialog" />
                        <q-btn outline color="grey-7" :label="$t('classes.edit')" icon="edit" @click="editClass" />
                        <q-btn outline color="negative" :label="$t('classes.delete')" icon="delete"
                            @click="confirmDeleteClass" />
                    </div>
                </div>

                <!-- Students Card -->
                <q-card class="academic-card">
                    <q-card-section class="q-pb-none">
                        <div class="row items-center justify-between">
                            <h3 class="text-h5 q-ma-none">
                                {{ $t('classDetail.assignedStudents') }}
                                <q-chip :label="assignedStudents.length" color="primary" text-color="white" size="sm"
                                    class="q-ml-sm" />
                            </h3>

                            <!-- Search Input -->
                            <q-input v-model="searchQuery" :placeholder="$t('students.searchPlaceholder')" outlined
                                dense style="min-width: 250px">
                                <template #prepend>
                                    <q-icon name="search" />
                                </template>
                                <template #append>
                                    <q-icon v-if="searchQuery" name="clear" class="cursor-pointer"
                                        @click="searchQuery = ''" />
                                </template>
                            </q-input>
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <!-- Empty State -->
                        <div v-if="assignedStudents.length === 0" class="text-center q-py-xl">
                            <q-icon name="school" size="64px" color="grey-4" class="q-mb-md" />
                            <p class="text-h6 text-grey-6 q-mb-sm">{{ $t('classDetail.noStudentsAssigned') }}</p>
                            <q-btn color="primary" :label="$t('classDetail.assignStudents')" icon="people"
                                @click="openAssignDialog" />
                        </div>

                        <!-- No Search Results -->
                        <div v-else-if="filteredStudents.length === 0" class="text-center q-py-xl">
                            <q-icon name="search_off" size="64px" color="grey-4" class="q-mb-md" />
                            <p class="text-h6 text-grey-6">{{ $t('students.noSearchResults') }}</p>
                        </div>

                        <!-- Students Table -->
                        <q-table v-else :rows="filteredStudents" :columns="columns" row-key="id" flat
                            class="academic-table" :pagination="{ rowsPerPage: $q.screen.lt.md ? 8 : 15 }"
                            :grid="$q.screen.xs" :hide-header="$q.screen.xs">
                            <!-- Mobile grid view -->
                            <template #item="props" v-if="$q.screen.xs">
                                <div class="q-pa-xs col-xs-12">
                                    <q-card class="mobile-card">
                                        <q-card-section>
                                            <div class="text-h6">{{ props.row.firstName }} {{ props.row.lastName }}
                                            </div>
                                            <div class="text-caption text-grey-7 q-mb-sm">{{ $t('students.student') }} -
                                                {{ currentClass?.name }}</div>

                                            <div v-if="getOtherClasses(props.row.id).length > 0" class="q-mb-sm">
                                                <div class="text-caption text-grey-7 q-mb-xs">{{
                                                    $t('classDetail.otherClasses') }}:</div>
                                                <div class="row q-gutter-xs">
                                                    <q-chip v-for="cls in getOtherClasses(props.row.id)" :key="cls.id"
                                                        size="sm" color="secondary" text-color="white"
                                                        :label="cls.name" />
                                                </div>
                                            </div>
                                            <div v-else class="text-caption text-grey-6 q-mb-sm">{{
                                                $t('classDetail.noOtherClasses') }}</div>

                                            <div class="row q-gutter-sm justify-end">
                                                <q-btn flat dense icon="edit" color="grey-7" size="sm"
                                                    @click="editStudent(props.row)">
                                                    <q-tooltip>{{ $t('students.edit') }}</q-tooltip>
                                                </q-btn>
                                                <q-btn flat dense icon="remove_circle" color="negative" size="sm"
                                                    @click="confirmRemoveStudent(props.row)">
                                                    <q-tooltip>{{ $t('classDetail.removeFromClass') }}</q-tooltip>
                                                </q-btn>
                                            </div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </template>

                            <!-- Desktop/tablet table view -->
                            <template #body="props" v-else>
                                <q-tr :props="props">
                                    <q-td key="firstName" :props="props">
                                        <div class="text-body1 text-weight-medium">{{ props.row.firstName }}</div>
                                    </q-td>
                                    <q-td key="lastName" :props="props">
                                        <div class="text-body1 text-weight-medium">{{ props.row.lastName }}</div>
                                    </q-td>
                                    <q-td key="otherClasses" :props="props">
                                        <div v-if="getOtherClasses(props.row.id).length > 0" class="row q-gutter-xs">
                                            <q-chip v-for="cls in getOtherClasses(props.row.id)" :key="cls.id" size="sm"
                                                color="secondary" text-color="white" :label="cls.name" />
                                        </div>
                                        <span v-else class="text-grey-6 text-italic">{{ $t('classDetail.noOtherClasses')
                                        }}</span>
                                    </q-td>
                                    <q-td key="actions" :props="props">
                                        <!-- Mobile: Dropdown menu for actions -->
                                        <div v-if="$q.screen.lt.md" class="mobile-actions">
                                            <q-btn-dropdown flat round dense icon="more_vert" color="grey-7" size="md">
                                                <q-list>
                                                    <q-item clickable v-close-popup @click="editStudent(props.row)">
                                                        <q-item-section avatar>
                                                            <q-icon name="edit" color="grey-7" />
                                                        </q-item-section>
                                                        <q-item-section>
                                                            <q-item-label>{{ $t('students.edit') }}</q-item-label>
                                                        </q-item-section>
                                                    </q-item>
                                                    <q-separator />
                                                    <q-item clickable v-close-popup
                                                        @click="confirmRemoveStudent(props.row)">
                                                        <q-item-section avatar>
                                                            <q-icon name="remove_circle" color="negative" />
                                                        </q-item-section>
                                                        <q-item-section>
                                                            <q-item-label class="text-negative">{{
                                                                $t('classDetail.removeFromClass') }}</q-item-label>
                                                        </q-item-section>
                                                    </q-item>
                                                </q-list>
                                            </q-btn-dropdown>
                                        </div>

                                        <!-- Desktop: Individual buttons -->
                                        <div v-else class="row q-gutter-xs">
                                            <q-btn flat round dense icon="edit" color="grey-7" size="sm"
                                                @click="editStudent(props.row)">
                                                <q-tooltip>{{ $t('students.edit') }}</q-tooltip>
                                            </q-btn>
                                            <q-btn flat round dense icon="remove_circle" color="negative" size="sm"
                                                @click="confirmRemoveStudent(props.row)">
                                                <q-tooltip>{{ $t('classDetail.removeFromClass') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <!-- Assignment Dialog -->
        <q-dialog v-model="uiStore.showAssignDialog" persistent :maximized="$q.screen.lt.md">
            <q-card :style="$q.screen.lt.md ? '' : 'min-width: 600px'" class="assignment-dialog">
                <q-card-section>
                    <div class="row items-center">
                        <div class="col">
                            <h3 class="text-h5 q-ma-none">{{ $t('assignment.title') }}</h3>
                            <p class="text-body2 text-grey-7">
                                {{ $t('assignment.classSubtitle', { name: currentClass?.name }) }}
                            </p>
                        </div>
                        <q-btn v-if="$q.screen.lt.md" flat round dense icon="close" @click="closeAssignDialog" />
                    </div>
                </q-card-section>

                <q-card-section class="assignment-content">
                    <!-- Desktop: Two columns -->
                    <div v-if="$q.screen.gt.sm" class="row q-gutter-lg">
                        <div class="col">
                            <h4 class="text-h6 q-ma-none q-mb-md">{{ $t('assignment.availableStudents') }}</h4>
                            <q-input v-model="studentSearchQuery" :placeholder="$t('assignment.searchPlaceholder')"
                                outlined dense class="q-mb-md">
                                <template #prepend>
                                    <q-icon name="search" />
                                </template>
                            </q-input>

                            <q-list bordered class="rounded-borders assignment-list">
                                <q-item v-for="student in availableStudents" :key="student.id" clickable v-ripple
                                    @click="toggleStudentSelection(student)">
                                    <q-item-section avatar>
                                        <q-checkbox :model-value="uiStore.selectedStudentIds.includes(student.id)"
                                            @update:model-value="toggleStudentSelection(student)" />
                                    </q-item-section>
                                    <q-item-section>
                                        <q-item-label>{{ student.firstName }} {{ student.lastName }}</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item v-if="availableStudents.length === 0">
                                    <q-item-section class="text-center text-grey-6">
                                        {{ $t('assignment.noAvailableStudents') }}
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </div>

                        <div class="col">
                            <h4 class="text-h6 q-ma-none q-mb-md">{{ $t('assignment.assignedStudents') }}</h4>
                            <div class="q-mb-md" style="height: 32px">
                                <!-- Spacer to align with search input -->
                            </div>

                            <q-list bordered class="rounded-borders assignment-list">
                                <q-item v-for="student in assignedStudents" :key="student.id" clickable v-ripple>
                                    <q-item-section>
                                        <q-item-label>{{ student.firstName }} {{ student.lastName }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-btn flat round dense icon="remove" size="sm"
                                            @click="removeStudentFromClass(student)" />
                                    </q-item-section>
                                </q-item>

                                <q-item v-if="assignedStudents.length === 0">
                                    <q-item-section class="text-center text-grey-6">
                                        {{ $t('assignment.noAssignedStudents') }}
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </div>
                    </div>

                    <!-- Mobile: Stacked layout with tabs -->
                    <div v-else>
                        <q-tabs v-model="activeTab" class="text-primary q-mb-md" align="justify">
                            <q-tab name="available" :label="$t('assignment.availableStudents')" />
                            <q-tab name="assigned" :label="$t('assignment.assignedStudents')" />
                        </q-tabs>

                        <q-tab-panels v-model="activeTab" animated>
                            <q-tab-panel name="available" class="q-pa-none">
                                <q-input v-model="studentSearchQuery" :placeholder="$t('assignment.searchPlaceholder')"
                                    outlined dense class="q-mb-md">
                                    <template #prepend>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>

                                <q-list bordered class="rounded-borders mobile-assignment-list">
                                    <q-item v-for="student in availableStudents" :key="student.id" clickable v-ripple
                                        @click="toggleStudentSelection(student)">
                                        <q-item-section avatar>
                                            <q-checkbox :model-value="uiStore.selectedStudentIds.includes(student.id)"
                                                @update:model-value="toggleStudentSelection(student)" />
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>{{ student.firstName }} {{ student.lastName }}</q-item-label>
                                        </q-item-section>
                                    </q-item>

                                    <q-item v-if="availableStudents.length === 0">
                                        <q-item-section class="text-center text-grey-6">
                                            {{ $t('assignment.noAvailableStudents') }}
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-tab-panel>

                            <q-tab-panel name="assigned" class="q-pa-none">
                                <q-list bordered class="rounded-borders mobile-assignment-list">
                                    <q-item v-for="student in assignedStudents" :key="student.id" clickable v-ripple>
                                        <q-item-section>
                                            <q-item-label>{{ student.firstName }} {{ student.lastName }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-btn flat round dense icon="remove" size="sm"
                                                @click="removeStudentFromClass(student)" />
                                        </q-item-section>
                                    </q-item>

                                    <q-item v-if="assignedStudents.length === 0">
                                        <q-item-section class="text-center text-grey-6">
                                            {{ $t('assignment.noAssignedStudents') }}
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-tab-panel>
                        </q-tab-panels>
                    </div>

                    <!-- Action Buttons -->
                    <div class="assignment-actions q-mt-md">
                        <!-- Mobile: Stack buttons vertically -->
                        <div v-if="$q.screen.lt.sm" class="column q-gutter-sm">
                            <q-btn outline :label="$t('assignment.addSelected')" icon="arrow_forward"
                                @click="assignSelectedStudents" :disable="uiStore.selectedStudentIds.length === 0" />
                            <q-btn outline :label="$t('assignment.assignAll')" icon="double_arrow"
                                @click="assignAllStudents" :disable="availableStudents.length === 0" />
                            <q-btn outline color="negative" :label="$t('assignment.clear')" icon="clear_all"
                                @click="clearAllAssignments" :disable="assignedStudents.length === 0" />
                        </div>

                        <!-- Desktop/Tablet: Row layout -->
                        <div v-else class="row q-gutter-sm justify-center">
                            <q-btn outline :label="$t('assignment.addSelected')" icon="arrow_forward"
                                @click="assignSelectedStudents" :disable="uiStore.selectedStudentIds.length === 0" />
                            <q-btn outline :label="$t('assignment.assignAll')" icon="double_arrow"
                                @click="assignAllStudents" :disable="availableStudents.length === 0" />
                            <q-btn outline color="negative" :label="$t('assignment.clear')" icon="clear_all"
                                @click="clearAllAssignments" :disable="assignedStudents.length === 0" />
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="q-pa-md">
                    <q-btn flat :label="$t('assignment.cancel')" @click="closeAssignDialog" />
                    <q-btn color="primary" :label="$t('assignment.save')" @click="saveAssignments"
                        :loading="isLoading" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Edit Class Dialog -->
        <q-dialog v-model="showEditDialog" persistent :maximized="$q.screen.lt.sm">
            <q-card :style="$q.screen.lt.sm ? '' : 'min-width: 500px'" class="q-pa-md responsive-dialog">
                <q-card-section>
                    <h3 class="text-h5 q-ma-none">{{ $t('classes.editTitle') }}</h3>
                </q-card-section>

                <q-card-section>
                    <q-form @submit="saveClass" class="q-gutter-md">
                        <q-input v-model="classForm.name" :label="$t('classes.name')" outlined
                            :rules="[val => !!val || $t('classes.nameRequired')]" maxlength="128" />
                        <q-input v-model="classForm.description" :label="$t('classes.description')" outlined
                            type="textarea" rows="3" maxlength="500" counter />
                    </q-form>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat :label="$t('classes.cancel')" @click="showEditDialog = false" />
                    <q-btn color="primary" :label="$t('classes.save')" @click="saveClass" :loading="isLoading" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Remove Student Confirmation -->
        <q-dialog v-model="showRemoveDialog" persistent :maximized="$q.screen.xs">
            <q-card class="responsive-dialog">
                <q-card-section class="row items-center">
                    <q-avatar icon="warning" color="warning" text-color="white" />
                    <span class="q-ml-sm text-body1">
                        {{ $t('classDetail.confirmRemove', {
                            studentName: `${studentToRemove?.firstName} ${studentToRemove?.lastName}`,
                            className: currentClass?.name
                        }) }}
                    </span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat :label="$t('students.cancel')" @click="showRemoveDialog = false" />
                    <q-btn color="negative" :label="$t('classDetail.removeFromClass')" @click="removeStudent"
                        :loading="isLoading" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Delete Class Confirmation -->
        <q-dialog v-model="showDeleteDialog" persistent :maximized="$q.screen.xs">
            <q-card class="responsive-dialog">
                <q-card-section class="row items-center">
                    <q-avatar icon="warning" color="negative" text-color="white" />
                    <span class="q-ml-sm text-body1">
                        {{ $t('classes.confirmDelete', { name: currentClass?.name }) }}
                    </span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat :label="$t('classes.cancel')" @click="showDeleteDialog = false" />
                    <q-btn color="negative" :label="$t('classes.delete')" @click="deleteClass" :loading="isLoading" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<style scoped>
.constrain-more {
    max-width: 1200px;
    margin: 0 auto;
}

.academic-table .q-table tbody tr:hover {
    background-color: var(--q-primary-1);
}

/* Mobile action button improvements */
.mobile-actions {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Mobile card styling for grid view */
.mobile-card {
    border: 1px solid #E6EEF5;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.mobile-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

/* Class action buttons responsive layout */
.class-actions {
    width: 100%;
}

/* Assignment dialog responsive styles */
.assignment-dialog {
    max-height: 90vh;
}

.assignment-content {
    max-height: 60vh;
    overflow-y: auto;
}

.assignment-list {
    max-height: 300px;
    overflow-y: auto;
}

.mobile-assignment-list {
    max-height: 40vh;
    overflow-y: auto;
}

.assignment-actions {
    position: sticky;
    bottom: 0;
    background: white;
    padding-top: 16px;
    border-top: 1px solid #E6EEF5;
    margin-top: 16px;
}

/* Ensure mobile table rows have adequate height */
@media (max-width: 599px) {
    .academic-table .q-table tbody td {
        padding: 12px 8px;
    }

    .academic-table .q-table tbody tr {
        min-height: 56px;
    }

    /* Mobile header improvements */
    .constrain-more h1 {
        font-size: 1.5rem !important;
    }

    /* Make search input full width on mobile */
    .q-card-section .row .q-input {
        min-width: 100% !important;
        margin-bottom: 16px;
    }

    /* Mobile dialog improvements */
    .assignment-dialog .q-card-section {
        padding: 16px;
    }

    .assignment-actions {
        margin: 16px -16px -16px -16px;
        padding: 16px;
    }

    /* General responsive dialog styles */
    .responsive-dialog {
        width: 100% !important;
        max-width: none !important;
        height: 100% !important;
        max-height: none !important;
        border-radius: 0 !important;
    }
}
</style>
