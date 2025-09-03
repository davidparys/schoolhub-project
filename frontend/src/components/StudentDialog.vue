<template>
    <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
        <q-card style="min-width: 400px">
            <q-card-section>
                <div class="text-h6">
                    {{ student ? $t('students.editStudent') : $t('students.addStudent') }}
                </div>
            </q-card-section>

            <q-card-section>
                <q-form @submit="onSubmit" class="q-gutter-md">
                    <q-input v-model="form.firstName" :label="$t('students.firstName')" outlined
                        :rules="[val => !!val || $t('students.firstNameRequired')]" maxlength="64" autofocus />

                    <q-input v-model="form.lastName" :label="$t('students.lastName')" outlined
                        :rules="[val => !!val || $t('students.lastNameRequired')]" maxlength="64" />
                </q-form>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat :label="$t('common.cancel')" color="primary" @click="onCancel" />
                <q-btn flat :label="$t('common.save')" color="primary" @click="onSubmit" :loading="loading" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Student, CreateStudentRequest, UpdateStudentRequest } from './models'

interface Props {
    modelValue: boolean
    student?: Student | null
    loading?: boolean
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', data: CreateStudentRequest | UpdateStudentRequest): void
}

const props = withDefaults(defineProps<Props>(), {
    student: null,
    loading: false
})

const emit = defineEmits<Emits>()

const form = ref({
    firstName: '',
    lastName: ''
})

// Watch for student changes to populate form
watch(() => props.student, (newStudent) => {
    if (newStudent) {
        form.value = {
            firstName: newStudent.firstName,
            lastName: newStudent.lastName
        }
    } else {
        form.value = {
            firstName: '',
            lastName: ''
        }
    }
}, { immediate: true })

const onSubmit = () => {
    if (!form.value.firstName.trim() || !form.value.lastName.trim()) {
        return
    }

    const data = {
        firstName: form.value.firstName.trim(),
        lastName: form.value.lastName.trim()
    }

    emit('save', data)
}

const onCancel = () => {
    emit('update:modelValue', false)
    // Reset form
    form.value = {
        firstName: '',
        lastName: ''
    }
}
</script>
