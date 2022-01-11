DEFAULT_HAS_HEADERS = false
DEFAULT_FORCE = false

class Api::ProspectsFilesController < ApplicationController
    def is_true(api_resp)
        api_resp == "true" or api_resp == true
    end

    def is_numeric(input)
        Float(input) != nil rescue false
    end

    def validate_insert_prospects_params(email_index, first_name_index, last_name_index)
        email_index_is_num = is_numeric(email_index)
        first_name_index_is_num = is_numeric(first_name_index)
        last_name_index_is_num = is_numeric(last_name_index)
        equality = (email_index == first_name_index or
                    email_index == last_name_index or
                    first_name_index == last_name_index)
        return (email_index_is_num and first_name_index_is_num and last_name_index_is_num and !equality)
    end

    def show_insert_progress
        prospects_files = ProspectsFiles.find(params.require(:id))

        if !prospects_files
            return render status: 404, json: {message: "ProspectsFiles with this ID not found."}
        elsif prospects_files.user_id != @user.id
            return render status: 403, json: {message: "This file does not belong to this user."}
        else
        
            if !prospects_files.csv_total_rows
                total = CSV.foreach(prospects_files.file_path).count
                prospects_files.update({
                    csv_total_rows: total,
                })
            else
                total = prospects_files.csv_total_rows
            end

            prospects_inserted_count = Prospect.where(prospects_files_id: prospects_files.id).count
            render json: {total: total, done: prospects_inserted_count}
        end
    end

    def insert_prospects
        prospects_files = ProspectsFiles.find(params.require(:id))

        if !prospects_files
            return render status: 404, json: {message: "ProspectsFiles with this ID not found."}
        elsif prospects_files.user_id != @user.id
            return render status: 403, json: {message: "This file does not belong to this user."}
        else
        
            email_index_check = params.require(:email_index)
            first_name_index_check = params.require(:first_name_index)
            last_name_index_check = params.require(:last_name_index)

            prospects_files_params_are_valid = validate_insert_prospects_params(email_index_check, first_name_index_check, last_name_index_check)

            unless prospects_files_params_are_valid
                return render status: 400, json: {message: "Index parameters are not valid."}
            end    
            
            email_index = email_index_check.to_i
            first_name_index = first_name_index_check.to_i
            last_name_index = last_name_index_check.to_i
            force = is_true(params[:force])
            has_headers = is_true(params[:has_headers])

            InsertProspectsFromCsvJob.perform_later(@user.id, prospects_files.id, email_index, first_name_index, last_name_index, force, has_headers)

            render json: {prospects_files: prospects_files}
        end
    end

    def create
        file_upload = params.require(:file)
        
        new_prospects_files = ProspectsFiles.create({
            user_id: @user.id,
            file: {
                io: file_upload,
                filename: file_upload.original_filename,
            },
        })

        if new_prospects_files.valid?
            preview = CSV.foreach(file_upload).take(5)
            render json: {id: new_prospects_files.id, preview: preview}
        else

            if new_prospects_files.errors.full_messages.include?("Must be a CSV")
                error_status = 415
            else
                error_status = 413
            end

            render status: error_status, json: {message: new_prospects_files.errors.full_messages}
        end

    end
end