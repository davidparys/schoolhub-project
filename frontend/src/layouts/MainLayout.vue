<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '../stores/ui';

const router = useRouter();
const { locale } = useI18n();
const uiStore = useUiStore();

const rightDrawerOpen = ref(false);

// Computed property for toast visibility with proper getter/setter
const toastVisible = computed({
  get: () => uiStore.showToast,
  set: (value: boolean) => {
    if (!value) {
      uiStore.hideNotification();
    }
  }
});

// Language management
const currentLanguage = computed(() => {
  return uiStore.language === 'pl' ? 'pl' : 'en';
});

const currentLanguageLabel = computed(() => {
  return currentLanguage.value === 'pl' ? 'Polski' : 'English';
});

function setLanguage(lang: 'en' | 'pl') {
  uiStore.setLanguage(lang);
  locale.value = lang === 'pl' ? 'pl' : 'en-US';
}

// Navigation functions
function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

function navigateAndClose(path: string) {
  void router.push(path);
  rightDrawerOpen.value = false;
}

function addStudentAndClose() {
  uiStore.openStudentDialog();
  rightDrawerOpen.value = false;
}

function addClassAndClose() {
  uiStore.openClassDialog();
  rightDrawerOpen.value = false;
}

// Initialize language from store on mount
uiStore.loadLanguageFromStorage();
locale.value = uiStore.language === 'pl' ? 'pl' : 'en-US';
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Academic-themed header with top navigation -->
    <q-header class="bg-white text-dark shadow-1">
      <q-toolbar class="constrain-more mobile-toolbar">
        <!-- Mobile layout -->
        <template v-if="$q.screen.lt.md">
          <!-- Mobile menu button -->
          <q-btn flat dense round icon="menu" aria-label="Menu" color="primary" @click="toggleRightDrawer"
            class="mobile-menu-btn" />

          <!-- App title (shorter on mobile) -->
          <q-toolbar-title class="text-h5 text-weight-bold mobile-title" style="font-family: 'Merriweather', serif;">
            School
          </q-toolbar-title>

          <!-- Mobile actions (only essential ones) -->
          <div class="mobile-actions">
            <!-- Context-sensitive add button -->
            <q-btn v-if="$route.name === 'students'" color="primary" icon="add" round size="sm"
              @click="uiStore.openStudentDialog()">
              <q-tooltip>{{ $t('students.addStudent') }}</q-tooltip>
            </q-btn>
            <q-btn v-else-if="$route.name === 'classes'" color="primary" icon="add" round size="sm"
              @click="uiStore.openClassDialog()">
              <q-tooltip>{{ $t('classes.addClass') }}</q-tooltip>
            </q-btn>
          </div>
        </template>

        <!-- Desktop layout -->
        <template v-else>
          <!-- App title with academic typography -->
          <q-toolbar-title class="text-h3 text-weight-bold" style="font-family: 'Merriweather', serif;">
            School Hub
          </q-toolbar-title>

          <!-- Desktop navigation -->
          <div class="row q-gutter-md">
            <q-btn flat no-caps :label="$t('nav.students')" :color="$route.name === 'students' ? 'primary' : 'grey-7'"
              @click="$router.push('/students')" />
            <q-btn flat no-caps :label="$t('nav.classes')"
              :color="$route.name === 'classes' || $route.name === 'class-detail' ? 'primary' : 'grey-7'"
              @click="$router.push('/classes')" />
          </div>

          <!-- Right side actions -->
          <div class="row q-gutter-sm items-center">
            <!-- Add Student button -->
            <q-btn v-if="$route.name === 'students'" color="primary" :label="$t('students.addStudent')" icon="add"
              no-caps @click="uiStore.openStudentDialog()" />

            <!-- Add Class button -->
            <q-btn v-if="$route.name === 'classes'" color="primary" :label="$t('classes.addClass')" icon="add" no-caps
              @click="uiStore.openClassDialog()" />

            <!-- Language selector -->
            <q-btn-dropdown flat color="grey-7" :label="currentLanguageLabel" icon="language" no-caps>
              <q-list>
                <q-item clickable v-close-popup @click="setLanguage('en')">
                  <q-item-section>
                    <q-item-label>English</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="setLanguage('pl')">
                  <q-item-section>
                    <q-item-label>Polski</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <!-- Help button -->
            <q-btn flat round dense icon="help_outline" color="grey-7" aria-label="Help" />
          </div>
        </template>
      </q-toolbar>
    </q-header>

    <!-- Mobile right drawer -->
    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered class="bg-white" v-if="$q.screen.lt.md">
      <q-list class="q-pa-md">
        <q-item-label header class="text-primary text-weight-bold">
          {{ $t('nav.navigation') }}
        </q-item-label>

        <q-item clickable v-ripple :active="$route.name === 'students'" @click="navigateAndClose('/students')">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('nav.students') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple :active="$route.name === 'classes' || $route.name === 'class-detail'"
          @click="navigateAndClose('/classes')">
          <q-item-section avatar>
            <q-icon name="class" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('nav.classes') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Mobile actions -->
        <q-item v-if="$route.name === 'students'" clickable v-ripple @click="addStudentAndClose">
          <q-item-section avatar>
            <q-icon name="person_add" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-primary">{{ $t('students.addStudent') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="$route.name === 'classes'" clickable v-ripple @click="addClassAndClose">
          <q-item-section avatar>
            <q-icon name="add" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-primary">{{ $t('classes.addClass') }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Language selection in mobile -->
        <q-item-label header class="text-grey-7">
          {{ $t('nav.language') }}
        </q-item-label>

        <q-item clickable v-ripple @click="setLanguage('en')" :active="currentLanguage === 'en'">
          <q-item-section avatar>
            <q-icon name="language" />
          </q-item-section>
          <q-item-section>
            <q-item-label>English</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="setLanguage('pl')" :active="currentLanguage === 'pl'">
          <q-item-section avatar>
            <q-icon name="language" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Polski</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Main content area -->
    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>

    <!-- Toast notifications -->
    <q-dialog v-model="toastVisible">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">{{ uiStore.toastMessage }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<style scoped>
/* Mobile toolbar improvements */
.mobile-toolbar {
  padding: 0 8px;
  min-height: 56px;
}

.mobile-menu-btn {
  margin-right: 8px;
}

.mobile-title {
  flex: 1;
  text-align: center;
  font-size: 1.1rem !important;
  margin: 0 8px;
}

.mobile-actions {
  margin-left: 8px;
}

/* Ensure proper spacing on desktop */
@media (min-width: 1024px) {
  .constrain-more {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
}

/* Tablet adjustments */
@media (min-width: 600px) and (max-width: 1023px) {
  .constrain-more {
    padding: 0 16px;
  }
}
</style>
