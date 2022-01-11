class InsertProspectsFromCsvJob < ApplicationJob
  queue_as :default

  def perform(user_id, prospects_files_id, email_index, first_name_index, last_name_index, force, has_headers)

    prospects_files = ProspectsFiles.find(prospects_files_id)

    CSV.foreach(prospects_files.file_path, headers: has_headers) do |row|

      if row[email_index].nil? or !row[email_index].include?("@")
          next
      end

      if force
        Prospect.upsert({
            email: row[email_index],
            first_name: row[first_name_index],
            last_name: row[last_name_index],
            user_id: user_id,
            prospects_files_id: prospects_files.id,
        }, unique_by: %i[ email user_id ])
      else
        Prospect.insert({
          email: row[email_index],
          first_name: row[first_name_index],
          last_name: row[last_name_index],
          user_id: user_id,
          prospects_files_id: prospects_files.id,
        })
      end

    end

  end
end
