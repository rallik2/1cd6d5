class ProspectsFiles < ApplicationRecord
    belongs_to :user
    has_many :prospects
    has_one_attached :file
    validate :file_type_and_size

    def file_type_and_size
      return unless file.attached?

      accepted_file_types = ["text/csv", "application/csv"]
      unless accepted_file_types.include?(file.content_type)
        errors.add(:base, "Must be a CSV")
      end

      unless file.byte_size <= 200.megabytes
        errors.add(:base, "Larger than 200MB")
      end
    end

    def file_path
      ActiveStorage::Blob.service.path_for(file.key)
    end
  end