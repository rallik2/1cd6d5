class Api::ProspectsFilesController < ApplicationController

    def create
        file_upload = params.require(:file)
        new_prospects_files = ProspectsFiles.new({
            user_id: @user.id,
        })
        new_prospects_files.file.attach(file_upload)

        if new_prospects_files.valid?
            new_prospects_files.save
            preview = CSV.foreach(file_upload, headers: false).take(5)
            render json: {id: new_prospects_files.id, preview: preview}
        else
            render json: {error: new_prospects_files.errors.full_messages}
        end
      end
end