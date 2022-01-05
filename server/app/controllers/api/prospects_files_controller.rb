DEFAULT_FORCE = false
DEFAULT_HAS_HEADERS = true

class Api::ProspectsFilesController < ApplicationController
    def is_true(api_resp)
        api_resp == "true"
    end

    def show_insert_progress
        prospects_files_id = params.require(:id)
        count_and_total = CheckProspectsInsertProgressJob.perform_now prospects_files_id
        render json: count_and_total
    end

    def insert_prospects
        prospects_files = ProspectsFiles.find(params.require(:id))

        if prospects_files.user_id != @user.id
            return render status: 403, json: {message: "This file does not belong to this user."}
        end

        email_index = params.require(:email_index).to_i
        first_name_index = params.require(:first_name_index).to_i
        last_name_index = params.require(:last_name_index).to_i
        force = (is_true params[:force] || DEFAULT_FORCE)
        has_headers = (is_true params[:has_headers] || DEFAULT_HAS_HEADERS)

        CSV.foreach(prospects_files.file_path, headers: has_headers) do |row|

            if row[email_index].nil?
                next
            end

            prospect_in_db = Prospect.find_by(email: row[email_index])

            if !prospect_in_db
                Prospect.create({
                    email: row[email_index],
                    first_name: row[first_name_index],
                    last_name: row[last_name_index],
                    user_id: @user.id,
                    csv_id: prospects_files.id,
                })
            elsif force
                prospect_in_db.update({
                    first_name: row[first_name_index],
                    last_name: row[last_name_index],
                    user_id: @user.id,
                    csv_id: prospects_files.id,
                })
            else
                next
            end

        end
        render json: { prospects_files: prospects_files}
    end

    def create
        file_upload = params.require(:file)
        new_prospects_files = ProspectsFiles.new({
            user_id: @user.id,
        })
        new_prospects_files.file.attach(file_upload)

        if new_prospects_files.valid?
            file_upload_csv = CSV.read(file_upload, headers: false)
            total = file_upload_csv.length
            preview = file_upload_csv.take(5)
            new_prospects_files.total = total
            new_prospects_files.save

            render json: {id: new_prospects_files.id, preview: preview}
        else
            render json: {error: new_prospects_files.errors.full_messages}
        end

    end
end