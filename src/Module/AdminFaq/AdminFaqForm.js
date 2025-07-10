import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
} from '@coreui/react';
import CustomAlert from '../../components/New/CustomAlert';
import ActionButton from '../../components/New/ActionButton';
// import { adminApi } from '../../api/admin'; // Uncomment and update as needed

const FaqForm = ({ initialData, onSuccess, onError, setAlerts, onCancel, isEdit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category: '',
      question: '',
      answer: '',
      visibility: '',
      status: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        category: '',
        question: '',
        answer: '',
        visibility: '',
        status: '',
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    try {
      let response;

      if (isEdit && initialData?.id) {
        response = await adminApi.updateFaq(initialData.id, data);
      } else {
        response = await adminApi.createFaq(data);
      }

      setAlerts?.([
        {
          severity: 'success',
          message: response?.message || 'FAQ saved successfully.',
        },
      ]);

      onSuccess?.(response);
    } catch (err) {
      console.error('Error submitting FAQ:', err);
      setAlerts?.([
        {
          severity: 'error',
          message:
            err?.response?.data?.message ||
            'An unexpected error occurred.',
        },
      ]);
      onError?.(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 bg-white rounded-md border border-gray-200"
    >
      <CustomAlert alerts={[]} handleClose={() => {}} />
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? 'Edit FAQ' : 'Add New FAQ'}
      </h2>

      <CRow className="g-4">
        <CCol md={6}>
          <CFormSelect
            label="Category *"
            {...register('category', { required: 'Category is required' })}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Select Category
            </option>
            <option value="General">General</option>
            <option value="Billing">Billing</option>
            <option value="Technical">Technical</option>
          </CFormSelect>
          {errors.category && (
            <p className="text-red-500 text-sm">{errors.category.message}</p>
          )}
        </CCol>

        <CCol md={6}>
          <CFormInput
            label="Question *"
            placeholder="Enter the question"
            {...register('question', { required: 'Question is required' })}
          />
          {errors.question && (
            <p className="text-red-500 text-sm">{errors.question.message}</p>
          )}
        </CCol>
      </CRow>

      <CRow className="g-4">
        <CCol md={6}>
          <CFormSelect
            label="Visibility *"
            {...register('visibility', { required: 'Visibility is required' })}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Select Visibility
            </option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </CFormSelect>
          {errors.visibility && (
            <p className="text-red-500 text-sm">{errors.visibility.message}</p>
          )}
        </CCol>

        <CCol md={6}>
          <CFormSelect
            label="Status *"
            {...register('status', { required: 'Status is required' })}
            defaultValue=""
          >
            <option value="" disabled hidden>
              Select Status
            </option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </CFormSelect>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </CCol>
      </CRow>

      <div>
        <label className="block text-sm font-medium mb-1">Answer *</label>
        <textarea
          {...register('answer', { required: 'Answer is required' })}
          placeholder="Enter the answer"
          className="w-full h-32 p-2 border border-gray-300 rounded-md text-sm resize-y"
        />
        {errors.answer && (
          <p className="text-red-500 text-sm">{errors.answer.message}</p>
        )}
      </div>

      {isEdit && initialData?.created_at && (
        <div className="mt-4">
          <CFormInput
            label="Created At"
            value={new Date(initialData.created_at).toLocaleString()}
            disabled
          />
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-32 h-10 border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <div className="w-32 h-10">
          <ActionButton
            type="submit"
            label="Save"
            variant="primary"
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};

export default FaqForm;
