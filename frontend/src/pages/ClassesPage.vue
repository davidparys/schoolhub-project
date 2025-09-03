<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useStudents } from '../composables/useStudents';
import { useClasses } from '../composables/useClasses';
import { useStudentsStore } from '../stores/students';
import { useClassesStore } from '../stores/classes';
import { useUiStore } from '../stores/ui';
import type { Student, Class } from '../components/models';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const studentsStore = useStudentsStore();
const classesStore = useClassesStore();
const uiStore = useUiStore();

// Pinia Colada composables
const { data: students } = useStudents();
const { data: classes } = useClasses();


// Reactive data
const searchQuery = ref('');
const studentSearchQuery = ref('');
const activeTab = ref('available');
const isLoading = ref(false);
const editingClass = ref<Class | null>(null);
const selectedClass = ref<Class | null>(null);
const showDeleteDialog = ref(false);
const classToDelete = ref<Class | null>(null);

const classForm = ref({
    name: '',
    description: ''
});

// Table columns configuration
const columns = computed(() => [
    {
        name: 'name',
        label: t('classes.name'),
        field: 'name',
        align: 'left' as const,
        sortable: true
    },
    {
        name: 'description',
        label: t('classes.description'),
        field: 'description',
        align: 'left' as const
    },
    {
        name: 'studentsCount',
        label: t('classes.studentsCount'),
        field: 'studentsCount',
        align: 'center' as const
    },
    {
        name: 'actions',
        label: t('classes.actions'),
        field: 'actions',
        align: 'right' as const
    }
]);

// Computed properties
const filteredClasses = computed(() => {
    if (!classes.value) return [];
    if (!searchQuery.value) return classes.value;

    const query = searchQuery.value.toLowerCase();
    return classes.value.filter(cls =>
        cls.name.toLowerCase().includes(query) ||
        (cls.description && cls.description.toLowerCase().includes(query))
    );
});

const availableStudents = computed(() => {
    if (!selectedClass.value || !students.value) return [];

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

const assignedStudents = computed(() => {
    if (!selectedClass.value || !students.value) return [];
    return students.value.filter(student => student.classIds.includes(selectedClass.value!.id));
});

// Helper functions
function getStudentCount(classId: string): string {
    if (!students.value) return '0';
    const count = students.value.filter(student => student.classIds.includes(classId)).length;
    return count.toString();
}

function viewClassDetail(cls: Class) {
    void router.push(`/classes/${cls.id}`);
}

// Dialog management
function openAddDialog() {
    editingClass.value = null;
    classForm.value = {
        name: '',
        description: ''
    };
    uiStore.openClassDialog();
}

function editClass(cls: Class) {
    editingClass.value = cls;
    classForm.value = {
        name: cls.name,
        description: cls.description || ''
    };
    uiStore.openClassDialog();
}

function closeDialog() {
    editingClass.value = null;
    classForm.value = {
        name: '',
        description: ''
    };
    uiStore.closeClassDialog();
}

function assignStudents(cls: Class) {
    selectedClass.value = cls;
    studentSearchQuery.value = '';
    uiStore.clearStudentSelection();
    uiStore.openAssignDialog(cls.id);
}

function closeAssignDialog() {
    selectedClass.value = null;
    studentSearchQuery.value = '';
    uiStore.clearStudentSelection();
    uiStore.closeAssignDialog();
}

// CRUD operations
async function saveClass() {
    if (!classForm.value.name.trim()) {
        return;
    }

    isLoading.value = true;
    try {
        if (editingClass.value) {
            // Update existing class
            await classesStore.editClass(editingClass.value.id, {
                name: classForm.value.name.trim(),
                description: classForm.value.description.trim() || undefined
            });
            uiStore.showNotification('Class updated successfully', 'positive');
        } else {
            // Add new class
            await classesStore.addClass({
                name: classForm.value.name.trim(),
                description: classForm.value.description.trim() || undefined
            });
            uiStore.showNotification('Class added successfully', 'positive');
        }
        closeDialog();
    } catch (error) {
        console.error('Error saving class:', error);
        uiStore.showNotification('Error saving class', 'negative');
    } finally {
        isLoading.value = false;
    }
}

function confirmDelete(cls: Class) {
    classToDelete.value = cls;
    showDeleteDialog.value = true;
}

async function deleteClass() {
    if (!classToDelete.value) return;

    isLoading.value = true;
    try {
        // Remove class from all students first
        const assignedStudents = studentsStore.getStudentsByClassId(classToDelete.value.id);
        await Promise.all(assignedStudents.map(student =>
            studentsStore.removeFromClass(student.id, classToDelete.value!.id)
        ));

        // Then delete the class
        await classesStore.removeClass(classToDelete.value.id);
        uiStore.showNotification('Class deleted successfully', 'positive');
        showDeleteDialog.value = false;
        classToDelete.value = null;
    } catch (error) {
        console.error('Error deleting class:', error);
        uiStore.showNotification('Error deleting class', 'negative');
    } finally {
        isLoading.value = false;
    }
}

// Assignment operations
function toggleStudentSelection(student: Student) {
    uiStore.toggleStudentSelection(student.id);
}

function removeStudentFromClass(student: Student) {
    if (selectedClass.value) {
        void studentsStore.removeFromClass(student.id, selectedClass.value.id);
    }
}

function assignSelectedStudents() {
    if (selectedClass.value && uiStore.selectedStudentIds.length > 0) {
        void studentsStore.assignMultipleToClass([...uiStore.selectedStudentIds], selectedClass.value.id);
        uiStore.clearStudentSelection();
    }
}

function assignAllStudents() {
    if (selectedClass.value && availableStudents.value.length > 0) {
        const studentIds = availableStudents.value.map(s => s.id);
        void studentsStore.assignMultipleToClass(studentIds, selectedClass.value.id);
    }
}

function clearAllAssignments() {
    if (selectedClass.value && assignedStudents.value.length > 0) {
        const studentIds = assignedStudents.value.map(s => s.id);
        void studentsStore.removeMultipleFromClass(studentIds, selectedClass.value.id);
    }
}

function saveAssignments() {
    closeAssignDialog();
    uiStore.showNotification('Assignments saved successfully', 'positive');
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
                    <h1 class="text-h2 q-ma-none">{{ $t('classes.title') }}</h1>
                    <p class="text-body1 text-grey-7 q-mt-sm">
                        {{ $t('classes.subtitle', { count: classes?.length || 0 }) }}
                    </p>
                </div>
            </div>

            <!-- Classes Card Table -->
            <q-card class="academic-card">
                <q-card-section class="q-pb-none">
                    <div class="row items-center justify-between">
                        <h3 class="text-h5 q-ma-none">{{ $t('classes.title') }}</h3>
                        <div class="row q-gutter-sm">
                            <!-- Search Input -->
                            <q-input v-model="searchQuery" :placeholder="$t('classes.searchPlaceholder')" outlined dense
                                style="min-width: 250px" class="q-mr-md">
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
                    <div v-if="filteredClasses.length === 0 && !searchQuery" class="text-center q-py-xl">
                        <q-icon name="class" size="64px" color="grey-4" class="q-mb-md" />
                        <p class="text-h6 text-grey-6 q-mb-sm">{{ $t('classes.noClasses') }}</p>
                        <q-btn color="primary" :label="$t('classes.addClass')" icon="add" @click="openAddDialog" />
                    </div>

                    <!-- No Search Results -->
                    <div v-else-if="filteredClasses.length === 0" class="text-center q-py-xl">
                        <q-icon name="search_off" size="64px" color="grey-4" class="q-mb-md" />
                        <p class="text-h6 text-grey-6">{{ $t('classes.noSearchResults') }}</p>
                    </div>

                    <!-- Classes Table -->
                    <q-table v-else :rows="filteredClasses" :columns="columns" row-key="id" flat class="academic-table"
                        :pagination="{ rowsPerPage: $q.screen.lt.md ? 5 : 10 }" :grid="$q.screen.xs"
                        :hide-header="$q.screen.xs">
                        <!-- Mobile grid view -->
                        <template #item="props" v-if="$q.screen.xs">
                            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                                <q-card class="mobile-card cursor-pointer" @click="viewClassDetail(props.row)">
                                    <q-card-section>
                                        <div class="text-h6">{{ props.row.name }}</div>
                                        <div class="text-caption text-grey-7 q-mb-sm">{{ $t('classes.class') }}</div>

                                        <div v-if="props.row.description" class="text-body2 q-mb-sm">
                                            {{ props.row.description }}
                                        </div>
                                        <div v-else class="text-caption text-grey-6 q-mb-sm">{{
                                            $t('classes.noDescription') }}</div>

                                        <div class="row items-center justify-between q-mb-sm">
                                            <div class="text-caption text-grey-7">{{ $t('classes.studentsCount') }}:
                                            </div>
                                            <q-chip :label="getStudentCount(props.row.id)" color="primary"
                                                text-color="white" size="sm" />
                                        </div>

                                        <div class="row q-gutter-sm justify-end">
                                            <q-btn flat dense icon="visibility" color="primary" size="sm"
                                                @click.stop="viewClassDetail(props.row)">
                                                <q-tooltip>{{ $t('classes.viewDetails') }}</q-tooltip>
                                            </q-btn>
                                            <q-btn flat dense icon="edit" color="grey-7" size="sm"
                                                @click.stop="editClass(props.row)">
                                                <q-tooltip>{{ $t('classes.edit') }}</q-tooltip>
                                            </q-btn>
                                            <q-btn flat dense icon="people" color="secondary" size="sm"
                                                @click.stop="assignStudents(props.row)">
                                                <q-tooltip>{{ $t('classes.assignStudents') }}</q-tooltip>
                                            </q-btn>
                                            <q-btn flat dense icon="delete" color="negative" size="sm"
                                                @click.stop="confirmDelete(props.row)">
                                                <q-tooltip>{{ $t('classes.delete') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </template>

                        <!-- Desktop/tablet table view -->
                        <template #body="props" v-else>
                            <q-tr :props="props" class="cursor-pointer" @click="viewClassDetail(props.row)">
                                <q-td key="name" :props="props">
                                    <div class="text-body1 text-weight-medium">{{ props.row.name }}</div>
                                </q-td>
                                <q-td key="description" :props="props">
                                    <div v-if="props.row.description" class="text-body2">
                                        {{ props.row.description }}
                                    </div>
                                    <span v-else class="text-grey-6 text-italic">{{ $t('classes.noDescription')
                                        }}</span>
                                </q-td>
                                <q-td key="studentsCount" :props="props">
                                    <q-chip :label="getStudentCount(props.row.id)" color="primary" text-color="white"
                                        size="sm" />
                                </q-td>
                                <q-td key="actions" :props="props">
                                    <!-- Mobile: Dropdown menu for actions -->
                                    <div v-if="$q.screen.lt.md" class="mobile-actions">
                                        <q-btn-dropdown flat round dense icon="more_vert" color="grey-7" size="md">
                                            <q-list>
                                                <q-item clickable v-close-popup @click="viewClassDetail(props.row)">
                                                    <q-item-section avatar>
                                                        <q-icon name="visibility" color="primary" />
                                                    </q-item-section>
                                                    <q-item-section>
                                                        <q-item-label>{{ $t('classes.viewDetails') }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item clickable v-close-popup @click="editClass(props.row)">
                                                    <q-item-section avatar>
                                                        <q-icon name="edit" color="grey-7" />
                                                    </q-item-section>
                                                    <q-item-section>
                                                        <q-item-label>{{ $t('classes.edit') }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item clickable v-close-popup @click="assignStudents(props.row)">
                                                    <q-item-section avatar>
                                                        <q-icon name="people" color="secondary" />
                                                    </q-item-section>
                                                    <q-item-section>
                                                        <q-item-label>{{ $t('classes.assignStudents') }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-separator />
                                                <q-item clickable v-close-popup @click="confirmDelete(props.row)">
                                                    <q-item-section avatar>
                                                        <q-icon name="delete" color="negative" />
                                                    </q-item-section>
                                                    <q-item-section>
                                                        <q-item-label class="text-negative">{{ $t('classes.delete')
                                                            }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                        </q-btn-dropdown>
                                    </div>

                                    <!-- Desktop: Individual buttons -->
                                    <div v-else class="row q-gutter-xs">
                                        <q-btn flat round dense icon="visibility" color="primary" size="sm"
                                            @click.stop="viewClassDetail(props.row)">
                                            <q-tooltip>{{ $t('classes.viewDetails') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn flat round dense icon="edit" color="grey-7" size="sm"
                                            @click.stop="editClass(props.row)">
                                            <q-tooltip>{{ $t('classes.edit') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn flat round dense icon="people" color="secondary" size="sm"
                                            @click.stop="assignStudents(props.row)">
                                            <q-tooltip>{{ $t('classes.assignStudents') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn flat round dense icon="delete" color="negative" size="sm"
                                            @click.stop="confirmDelete(props.row)">
                                            <q-tooltip>{{ $t('classes.delete') }}</q-tooltip>
                                        </q-btn>
                                    </div>
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </q-card-section>
            </q-card>
        </div>

        <!-- Add/Edit Class Dialog -->
        <q-dialog v-model="uiStore.showClassDialog" persistent :maximized="$q.screen.lt.sm">
            <q-card :style="$q.screen.lt.sm ? '' : 'min-width: 500px'" class="q-pa-md responsive-dialog">
                <q-card-section>
                    <h3 class="text-h5 q-ma-none">
                        {{ editingClass ? $t('classes.editTitle') : $t('classes.addTitle') }}
                    </h3>
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
                    <q-btn flat :label="$t('classes.cancel')" @click="closeDialog" />
                    <q-btn color="primary" :label="$t('classes.save')" @click="saveClass" :loading="isLoading" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Delete Confirmation Dialog -->
        <q-dialog v-model="showDeleteDialog" persistent :maximized="$q.screen.xs">
            <q-card class="responsive-dialog">
                <q-card-section class="row items-center">
                    <q-avatar icon="warning" color="negative" text-color="white" />
                    <span class="q-ml-sm text-body1">
                        {{ $t('classes.confirmDelete', { name: classToDelete?.name }) }}
                    </span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat :label="$t('classes.cancel')" @click="showDeleteDialog = false" />
                    <q-btn color="negative" :label="$t('classes.delete')" @click="deleteClass" :loading="isLoading" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Student Assignment Dialog -->
        <q-dialog v-model="uiStore.showAssignDialog" persistent :maximized="$q.screen.lt.md">
            <q-card :style="$q.screen.lt.md ? '' : 'min-width: 600px'" class="assignment-dialog">
                <q-card-section>
                    <div class="row items-center">
                        <div class="col">
                            <h3 class="text-h5 q-ma-none">{{ $t('assignment.title') }}</h3>
                            <p class="text-body2 text-grey-7">
                                {{ $t('assignment.classSubtitle', { name: selectedClass?.name }) }}
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
