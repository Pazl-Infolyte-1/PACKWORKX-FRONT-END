import React, { useState } from "react";
import { cilHandPointRight, cilPencil, cilTrash } from "@coreui/icons";
import ThreeDotMenu from "../../components/ThreeDotMenu";
import DeleteModal from "../../components/New/DeleteModal";
import ReusableTable from "../SalesOrder/ReusableTable";

const sampleFaqData = [
  {
    faq: {
      id: 1,
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' at the login screen and follow the instructions.",
      category: "General",
      visibility: "public",
      status: "active",
      created_at: "2025-05-15T10:30:00Z",
    },
  },
  {
    faq: {
      id: 2,
      question: "Where can I view my billing history?",
      answer: "Go to your account settings and click on Billing > History.",
      category: "Billing",
      visibility: "private",
      status: "inactive",
      created_at: "2025-04-20T14:45:00Z",
    },
  },
  {
    faq: {
      id: 3,
      question: "How to contact support?",
      answer: "Use the contact form or email us at support@example.com.",
      category: "Technical",
      visibility: "public",
      status: "active",
      created_at: "2025-06-10T09:00:00Z",
    },
  },
];

const AdminFaqTable = ({
  faqData = sampleFaqData,
  handleEditFaq = (faq) => console.log("Edit clicked:", faq),
  handleViewFaq = (faq) => console.log("View clicked:", faq),
  setRefresh = (data) => console.log("Refreshed data:", data),
  isMinimized = false,
}) => {
  const [selectedFaqDeleteId, setSelectedFaqDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = (id) => {
    setSelectedFaqDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedFaqDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const deleteFaq = () => {
    if (!selectedFaqDeleteId) return;

    const updatedData = faqData.filter(
      (item) => item.faq.id !== selectedFaqDeleteId
    );
    setRefresh(updatedData);
    closeDeleteModal();
  };

  const handleViewClick = (faq) => {
    handleViewFaq(faq);
  };

  const fullColumns = [
    {
      key: "question",
      header: "Question",
      field: "faq.question",
      type: "custom",
      render: (row) => (
        <span
          className="text-primary underline cursor-pointer text-left block"
          onClick={() => handleViewClick(row.faq)}
          title="View FAQ"
        >
          {row.faq.question}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      field: "faq.category",
      type: "custom",
      render: (row) => (
        <div className="text-left cursor-pointer" onClick={() => handleViewClick(row.faq)}>
          {row.faq.category}
        </div>
      ),
    },
    {
      key: "visibility",
      header: "Visibility",
      field: "faq.visibility",
      type: "custom",
      render: (row) => (
        <div className="text-left cursor-pointer" onClick={() => handleViewClick(row.faq)}>
          <span
            className={`px-2.5 py-1 rounded-full text-sm font-medium ${
              row.faq.visibility === "public"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {row.faq.visibility}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      field: "faq.status",
      type: "custom",
      render: (row) => (
        <div className="text-left cursor-pointer" onClick={() => handleViewClick(row.faq)}>
          <span
            className={`px-2.5 py-1 rounded-full text-sm font-medium ${
              row.faq.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.faq.status || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Created At",
      field: "faq.created_at",
      type: "custom",
      render: (row) => (
        <div className="text-left cursor-pointer" onClick={() => handleViewClick(row.faq)}>
          {new Date(row.faq.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      field: "actions",
      type: "custom",
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: "View",
              icon: cilHandPointRight,
              onClick: () => handleViewClick(row.faq),
            },
            {
              label: "Edit",
              icon: cilPencil,
              onClick: () => handleEditFaq(row.faq),
            },
            {
              label: "Delete",
              icon: cilTrash,
              onClick: () => openDeleteModal(row.faq.id),
            },
          ]}
        />
      ),
    },
  ];

  const minimizedColumns = [
    {
      key: "question",
      header: "Question",
      field: "faq.question",
      type: "custom",
      render: (row) => (
        <span
          className="text-primary underline cursor-pointer text-left block"
          onClick={() => handleViewClick(row.faq)}
          title="View FAQ"
        >
          {row.faq.question}
        </span>
      ),
    },
  ];

  return (
    <>
      <ReusableTable
        columns={isMinimized ? minimizedColumns : fullColumns}
        data={faqData}
        handleRowClick={(row) => handleViewClick(row.faq)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteFaq}
        title="Delete Confirmation"
        message="Are you sure you want to delete this FAQ?"
      />
    </>
  );
};

export default AdminFaqTable;
