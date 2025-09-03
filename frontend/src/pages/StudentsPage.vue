<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent, useUpdateStudentClasses } from '../composables/useStudents';
import { useClasses } from '../composables/useClasses';

import { useUiStore } from '../stores/ui';
import type { Student, Class } from '../components/models';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const uiStore = useUiStore();

// Pinia Colada composables
const { data: students } = useStudents();
const { data: classes } = useClasses();
const createStudentMutation = useCreateStudent();
const updateStudentMutation = useUpdateStudent();
const deleteStudentMutation = useDeleteStudent();
const updateStudentClassesMutation = useUpdateStudentClasses();

// Reactive data
const searchQuery = ref('');
const isLoading = ref(false);
const editingStudent = ref<Student | null>(null);
const selectedStudent = ref<Student | null>(null);
const showDeleteDialog = ref(false);
const studentToDelete = ref<Student | null>(null);
const selectedClassIds = ref<string[]>([]);

const studentForm = ref({
    firstName: '',
    lastName: '',
    classIds: [] as string[]
});

// Table columns configuration
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
        name: 'classes',
        label: t('students.classes'),
        field: 'classIds',
        align: 'left' as const
    },
    {
        name: 'actions',
        label: t('students.actions'),
        field: 'actions',
        align: 'right' as const
    }
]);

// Computed properties
const filteredStudents = computed(() => {
    if (!students.value) return [];
    if (!searchQuery.value) return students.value;

    const query = searchQuery.value.toLowerCase();
    return students.value.filter(student =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query)
    );
});

const classOptions = computed(() => {
    if (!classes.value) return [];
    return classes.value.map(cls => ({
        label: cls.name,
        value: cls.id
    }));
});

// Helper functions
function getStudentClasses(studentId: string): Class[] {
    if (!students.value || !classes.value) return [];

    const student = students.value.find(s => s.id === studentId);
    if (!student) return [];

    return student.classIds
        .map(classId => classes.value?.find(cls => cls.id === classId))
        .filter(cls => cls !== undefined);
}

function selectStudent(student: Student) {
    // Could be used for future row selection functionality
    console.log('Selected student:', student);
}

// Dialog management
function openAddDialog() {
    editingStudent.value = null;
    studentForm.value = {
        firstName: '',
        lastName: '',
        classIds: []
    };
    uiStore.openStudentDialog();
}

function editStudent(student: Student) {
    editingStudent.value = student;
    studentForm.value = {
        firstName: student.firstName,
        lastName: student.lastName,
        classIds: [...student.classIds]
    };
    uiStore.openStudentDialog();
}

function closeDialog() {
    editingStudent.value = null;
    studentForm.value = {
        firstName: '',
        lastName: '',
        classIds: []
    };
    uiStore.closeStudentDialog();
}

function assignStudent(student: Student) {
    selectedStudent.value = student;
    selectedClassIds.value = [...student.classIds];
    uiStore.openAssignDialog();
}

function closeAssignDialog() {
    selectedStudent.value = null;
    selectedClassIds.value = [];
    uiStore.closeAssignDialog();
}

// CRUD operations
async function saveStudent() {
    if (!studentForm.value.firstName.trim() || !studentForm.value.lastName.trim()) {
        return;
    }

    isLoading.value = true;
    try {
        if (editingStudent.value) {
            // Update existing student basic info
            await updateStudentMutation.mutateAsync({
                id: editingStudent.value.id,
                request: {
                    firstName: studentForm.value.firstName.trim(),
                    lastName: studentForm.value.lastName.trim()
                }
            });

            // Update class assignments if they changed
            if (studentForm.value.classIds.length > 0 || editingStudent.value.classIds.length > 0) {
                await updateStudentClassesMutation.mutateAsync({
                    studentId: editingStudent.value.id,
                    newClassIds: studentForm.value.classIds
                });
            }

            uiStore.showNotification('Student updated successfully', 'positive');
        } else {
            // Add new student
            const newStudent = await createStudentMutation.mutateAsync({
                firstName: studentForm.value.firstName.trim(),
                lastName: studentForm.value.lastName.trim()
            });

            // Assign to classes if any were selected
            if (studentForm.value.classIds.length > 0 && newStudent) {
                await updateStudentClassesMutation.mutateAsync({
                    studentId: newStudent.id,
                    newClassIds: studentForm.value.classIds
                });
            }

            uiStore.showNotification('Student added successfully', 'positive');
        }
        closeDialog();
    } catch (error) {
        console.error('Error saving student:', error);
        uiStore.showNotification('Error saving student', 'negative');
    } finally {
        isLoading.value = false;
    }
}

function confirmDelete(student: Student) {
    studentToDelete.value = student;
    showDeleteDialog.value = true;
}

async function deleteStudent() {
    if (!studentToDelete.value) return;

    isLoading.value = true;
    try {
        await deleteStudentMutation.mutateAsync(studentToDelete.value.id);
        uiStore.showNotification(t('toast.studentDeleted'), 'positive');
        showDeleteDialog.value = false;
        studentToDelete.value = null;
    } catch (error) {
        console.error('Error deleting student:', error);
        uiStore.showNotification(t('toast.error'), 'negative');
    } finally {
        isLoading.value = false;
    }
}

async function saveAssignments() {
    if (!selectedStudent.value) return;

    isLoading.value = true;
    try {
        // Use the new updateStudentClasses composable for proper class assignment handling
        const result = await updateStudentClassesMutation.mutateAsync({
            studentId: selectedStudent.value.id,
            newClassIds: selectedClassIds.value
        });

        const totalChanges = result.added + result.removed;
        if (totalChanges > 0) {
            uiStore.showNotification(
                t('toast.classAssignmentsUpdated', {
                    added: result.added,
                    removed: result.removed
                }) || `Updated class assignments: ${result.added} added, ${result.removed} removed`,
                'positive'
            );
        } else {
            uiStore.showNotification(
                t('toast.noChanges') || 'No changes made',
                'info'
            );
        }

        closeAssignDialog();
    } catch (error) {
        console.error('Error saving assignments:', error);
        uiStore.showNotification(t('toast.error') || 'Error updating class assignments', 'negative');
    } finally {
        isLoading.value = false;
    }
}

// Initialize data on mount
onMounted(() => {
    // Data will be automatically loaded via Pinia Colada useQuery
    // Mock data initialization is handled by the stores if needed
});
</script>

<template>
    <q-page class="q-pa-lg">
        <div class="constrain-more">
            <!-- Page Header -->
            <div class="row items-center justify-between q-mb-xl">
                <div>
                    <h1 class="text-h2 q-ma-none">{{ $t('students.title') }}</h1>
                    <p class="text-body1 text-grey-7 q-mt-sm">
                        {{ $t('students.subtitle', { count: students?.length || 0 }) }}
                    </p>
                </div>
            </div>

            <!-- Students Card Table -->
            <q-card class="academic-card">
                <q-card-section class="q-pb-none">
                    <div class="row items-center justify-between">
                        <h3 class="text-h5 q-ma-none">{{ $t('students.title') }}</h3>
                        <div class="row q-gutter-sm">
                            <!-- Search Input -->
                            <q-input v-model="searchQuery" :placeholder="$t('students.searchPlaceholder')" outlined
                                dense style="min-width: 250px" class="q-mr-md">
                                <template #prepend>
                                    <q-icon name="search" />
                                </template>
                                <template #append>
                                    <q-icon v-if="searchQuery" name="clear" class="cursor-pointer"
                                        @click="searchQuery = ''" />
                                </template>
                            </q-input>
                        </div>
                    </div>
                </q-card-section>

                <q-card-section>
                    <!-- Empty State -->
                    <div v-if="filteredStudents.length === 0 && !searchQuery" class="text-center q-py-xl">
                        <q-icon name="people_outline" size="64px" color="grey-4" class="q-mb-md" />
                        <p class="text-h6 text-grey-6 q-mb-sm">{{ $t('students.noStudents') }}</p>
                        <q-btn color="primary" :label="$t('students.addStudent')" icon="add" @click="openAddDialog" />
                    </div>

                    <!-- No Search Results -->
                    <div v-else-if="filteredStudents.length === 0" class="text-center q-py-xl">
                        <q-icon name="search_off" size="64px" color="grey-4" class="q-mb-md" />
                        <p class="text-h6 text-grey-6">{{ $t('students.noSearchResults') }}</p>
                    </div>

                    <!-- Students Table -->
                    <q-table v-else :rows="filteredStudents" :columns="columns" row-key="id" flat class="academic-table"
                        :pagination="{ rowsPerPage: $q.screen.lt.md ? 5 : 10 }" :grid="$q.screen.xs"
                        :hide-header="$q.screen.xs">
                        <!-- Mobile grid view -->
                        <template #item="props" v-if="$q.screen.xs">
                            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                                <q-card class="mobile-card">
                                    <q-card-section>
                                        <div class="text-h6">{{ props.row.firstName }} {{ props.row.lastName }}</div>
                                        <div class="text-caption text-grey-7 q-mb-sm">{{ $t('students.student') }}</div>

                                        <div v-if="getStudentClasses(props.row.id).length > 0" class="q-mb-sm">
                                            <div class="text-caption text-grey-7 q-mb-xs">{{ $t('students.classes') }}:
                                            </div>
                                            <div class="row q-gutter-xs">
                                                <q-chip v-for="cls in getStudentClasses(props.row.id)" :key="cls.id"
                                                    size="sm" color="primary" text-color="white" :label="cls.name" />
                                            </div>
                                        </div>
                                        <div v-else class="text-caption text-grey-6 q-mb-sm">{{ $t('students.noClasses')
                                        }}</div>

                                        <div class="row q-gutter-sm justify-end">
                                            <q-btn flat dense icon="edit" color="grey-7" size="sm"
                                                @click="editStudent(props.row)">
                                                <q-tooltip>{{ $t('students.edit') }}</q-tooltip>
                                            </q-btn>
                                            <q-btn flat dense icon="class" color="primary" size="sm"
                                                @click="assignStudent(props.row)">
                                                <q-tooltip>{{ $t('students.assign') }}</q-tooltip>
                                            </q-btn>
                                            <q-btn flat dense icon="delete" color="negative" size="sm"
                                                @click="confirmDelete(props.row)">
                                                <q-tooltip>{{ $t('students.delete') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </template>

                        <!-- Desktop/tablet table view -->
                        <template #body="props" v-else>
                            <q-tr :props="props" class="cursor-pointer" @click="selectStudent(props.row)">
                                <q-td key="firstName" :props="props">
                                    <div class="text-body1 text-weight-medium">{{ props.row.firstName }}</div>
                                </q-td>
                                <q-td key="lastName" :props="props">
                                    <div class="text-body1 text-weight-medium">{{ props.row.lastName }}</div>
                                </q-td>
                                <q-td key="classes" :props="props">
                                    <div v-if="getStudentClasses(props.row.id).length > 0" class="row q-gutter-xs">
                                        <q-chip v-for="cls in getStudentClasses(props.row.id)" :key="cls.id" size="sm"
                                            color="primary" text-color="white" :label="cls.name" />
                                    </div>
                                    <span v-else class="text-grey-6 text-italic">{{ $t('students.noClasses') }}</span>
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
                                                <q-item clickable v-close-popup @click="assignStudent(props.row)">
                                                    <q-item-section avatar>
                                                        <q-icon name="class" color="primary" />
                                                    </q-item-section>
                                                    <q-item-section>
                                                        <q-item-label>{{ $t('students.assign') }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-separator />
                                                <q-item clickable v-close-popup @click="confirmDelete(props.row)">
                                                    <q-item-section avatar>
                                                        <q-icon name="delete" color="negative" />
                                                    </q-item-section>
                                                    <q-item-section>
                                                        <q-item-label class="text-negative">{{ $t('students.delete')
                                                        }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                        </q-btn-dropdown>
                                    </div>

                                    <!-- Desktop: Individual buttons -->
                                    <div v-else class="row q-gutter-xs">
                                        <q-btn flat round dense icon="edit" color="grey-7" size="sm"
                                            @click.stop="editStudent(props.row)">
                                            <q-tooltip>{{ $t('students.edit') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn flat round dense icon="class" color="primary" size="sm"
                                            @click.stop="assignStudent(props.row)">
                                            <q-tooltip>{{ $t('students.assign') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn flat round dense icon="delete" color="negative" size="sm"
                                            @click.stop="confirmDelete(props.row)">
                                            <q-tooltip>{{ $t('students.delete') }}</q-tooltip>
                                        </q-btn>
                                    </div>
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </q-card-section>
            </q-card>
        </div>

        <!-- Add/Edit Student Dialog -->
        <q-dialog v-model="uiStore.showStudentDialog" persistent :maximized="$q.screen.lt.sm">
            <q-card :style="$q.screen.lt.sm ? '' : 'min-width: 400px'" class="q-pa-md responsive-dialog">
                <q-card-section>
                    <h3 class="text-h5 q-ma-none">
                        {{ editingStudent ? $t('students.editTitle') : $t('students.addTitle') }}
                    </h3>
                </q-card-section>

                <q-card-section>
                    <q-form @submit="saveStudent" class="q-gutter-md">
                        <q-input v-model="studentForm.firstName" :label="$t('students.firstName')" outlined
                            :rules="[val => !!val || $t('students.firstNameRequired')]" maxlength="64" />
                        <q-input v-model="studentForm.lastName" :label="$t('students.lastName')" outlined
                            :rules="[val => !!val || $t('students.lastNameRequired')]" maxlength="64" />

                        <!-- Optional class assignment -->
                        <q-select v-model="studentForm.classIds" :options="classOptions" :label="$t('students.classes')"
                            outlined multiple use-chips emit-value map-options option-value="value"
                            option-label="label" />
                    </q-form>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat :label="$t('students.cancel')" @click="closeDialog" />
                    <q-btn color="primary" :label="$t('students.save')" @click="saveStudent" :loading="isLoading" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Delete Confirmation Dialog -->
        <q-dialog v-model="showDeleteDialog" persistent :maximized="$q.screen.xs">
            <q-card class="responsive-dialog">
                <q-card-section class="row items-center">
                    <q-avatar icon="warning" color="negative" text-color="white" />
                    <span class="q-ml-sm text-body1">
                        {{ $t('students.confirmDelete', {
                            name: `${studentToDelete?.firstName}
                        ${studentToDelete?.lastName}`
                        })
                        }}
                    </span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat :label="$t('students.cancel')" @click="showDeleteDialog = false" />
                    <q-btn color="negative" :label="$t('students.delete')" @click="deleteStudent"
                        :loading="isLoading" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Assignment Dialog -->
        <q-dialog v-model="uiStore.showAssignDialog" persistent :maximized="$q.screen.lt.sm">
            <q-card :style="$q.screen.lt.sm ? '' : 'min-width: 500px'" class="responsive-dialog">
                <q-card-section>
                    <h3 class="text-h5 q-ma-none">{{ $t('assignment.title') }}</h3>
                    <p class="text-body2 text-grey-7">
                        {{ $t('assignment.studentSubtitle', {
                            name: `${selectedStudent?.firstName}
                        ${selectedStudent?.lastName}`
                        }) }}
                    </p>
                </q-card-section>

                <q-card-section>
                    <q-select v-model="selectedClassIds" :options="classOptions" :label="$t('students.classes')"
                        outlined multiple use-chips emit-value map-options option-value="value" option-label="label" />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat :label="$t('assignment.cancel')" @click="closeAssignDialog" />
                    <q-btn color="primary" :label="$t('assignment.save')" @click="saveAssignments"
                        :loading="isLoading" />
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

/* Ensure mobile table rows have adequate height */
@media (max-width: 599px) {
    .academic-table .q-table tbody td {
        padding: 12px 8px;
    }

    .academic-table .q-table tbody tr {
        min-height: 56px;
    }

    /* Make search input full width on mobile */
    .q-card-section .row .q-input {
        min-width: 100% !important;
        margin-bottom: 16px;
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
