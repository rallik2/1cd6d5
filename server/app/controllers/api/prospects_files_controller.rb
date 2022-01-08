class Api::ProspectsFilesController < ApplicationController
    def is_true(api_resp)
        api_resp == "true"
    end

    def show_insert_progress
        prospects_files = ProspectsFiles.find(params.require(:id))

        if !prospects_files
            return render status: 404, json: {message: "ProspectsFiles with this ID not found."}
        elsif prospects_files.user_id != @user.id
            return render status: 403, json: {message: "This file does not belong to this user."}
        else

        total = CSV.foreach(prospects_files.file_path).count
        prospects_inserted_count = Prospect.where(prospects_files_id: prospects_files.id).count
        render json: {total: total, done: prospects_inserted_count}
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
            force_check = params.require(:force)
            has_headers_check = params.require(:has_headers)

            prospects_files_params = [email_index_check, first_name_index_check, last_name_index_check, force_check, has_headers_check]
            valid_parameter_inputs = ["0", "1", "2", "true", "false"]

            if ((prospects_files_params - valid_parameter_inputs).any? or
                 email_index_check == first_name_index_check or
                 email_index_check == last_name_index_check or
                 first_name_index_check == last_name_index_check)
                return render status: 400, json: {message: "Index parameters are not valid."}
            end    
            
            email_index = email_index_check.to_i
            first_name_index = first_name_index_check.to_i
            last_name_index = last_name_index_check.to_i
            force = is_true(force_check)
            has_headers = is_true(has_headers_check)

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