// Mock API service to replace base44 SDK
import {
  mockOrganizations,
  mockJourneys,
  mockJourneyConfigs,
  mockUsers,
  mockAuditLogs,
  mockFeatureFlags
} from './mockData';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Generic CRUD operations factory
const createEntityService = (data, idPrefix = 'item') => {
  let items = [...data];

  return {
    async list() {
      await delay();
      return [...items];
    },

    async get(id) {
      await delay();
      const item = items.find(i => i.id === id);
      if (!item) throw new Error(`Item with id ${id} not found`);
      return { ...item };
    },

    async filter(criteria, limit) {
      await delay();
      let result = [...items];

      if (criteria) {
        result = result.filter(item => {
          return Object.entries(criteria).every(([key, value]) => item[key] === value);
        });
      }

      if (limit) {
        result = result.slice(0, limit);
      }

      return result;
    },

    async create(data) {
      await delay();
      const newItem = {
        id: `${idPrefix}-${Date.now()}`,
        ...data,
        created_at: new Date().toISOString()
      };
      items.push(newItem);
      return { ...newItem };
    },

    async update(id, data) {
      await delay();
      const index = items.findIndex(i => i.id === id);
      if (index === -1) throw new Error(`Item with id ${id} not found`);
      items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
      return { ...items[index] };
    },

    async delete(id) {
      await delay();
      const index = items.findIndex(i => i.id === id);
      if (index === -1) throw new Error(`Item with id ${id} not found`);
      items.splice(index, 1);
      return { success: true };
    },

    async bulkCreate(dataArray) {
      await delay();
      const newItems = dataArray.map((data, i) => ({
        id: `${idPrefix}-${Date.now()}-${i}`,
        ...data,
        created_at: new Date().toISOString()
      }));
      items.push(...newItems);
      return newItems.map(item => ({ ...item }));
    }
  };
};

// Entity services
export const Organization = createEntityService(mockOrganizations, 'org');
export const JourneyConfig = createEntityService(mockJourneyConfigs, 'config');
export const FeatureFlag = createEntityService(mockFeatureFlags, 'flag');

// Auth service mock
export const User = {
  async me() {
    await delay();
    return {
      id: 'user-1',
      email: 'admin@kycplatform.ae',
      name: 'Admin User',
      role: 'admin'
    };
  },

  async isAuthenticated() {
    await delay();
    return true;
  },

  login(redirectPath = '/') {
    console.log('Mock login - redirecting to:', redirectPath);
  },

  logout() {
    console.log('Mock logout');
  },

  setToken(token) {
    console.log('Mock setToken:', token);
  }
};

// Integration mocks
export const InvokeLLM = async (params) => {
  await delay(500);
  return { response: 'Mock LLM response for: ' + JSON.stringify(params) };
};

export const SendEmail = async (params) => {
  await delay(200);
  console.log('Mock SendEmail:', params);
  return { success: true, messageId: `msg-${Date.now()}` };
};

export const UploadFile = async (params) => {
  await delay(500);
  return {
    success: true,
    url: `https://mock-storage.example.com/files/${Date.now()}`,
    fileId: `file-${Date.now()}`
  };
};

export const GenerateImage = async (params) => {
  await delay(1000);
  return {
    success: true,
    url: 'https://via.placeholder.com/512'
  };
};

export const ExtractDataFromUploadedFile = async (params) => {
  await delay(800);
  return {
    success: true,
    data: { extracted: 'Mock extracted data' }
  };
};

export const CreateFileSignedUrl = async (params) => {
  await delay(200);
  return {
    signedUrl: `https://mock-storage.example.com/signed/${Date.now()}?token=mock`
  };
};

export const UploadPrivateFile = async (params) => {
  await delay(500);
  return {
    success: true,
    fileId: `private-file-${Date.now()}`
  };
};

export const Core = {
  InvokeLLM,
  SendEmail,
  UploadFile,
  GenerateImage,
  ExtractDataFromUploadedFile,
  CreateFileSignedUrl,
  UploadPrivateFile
};
