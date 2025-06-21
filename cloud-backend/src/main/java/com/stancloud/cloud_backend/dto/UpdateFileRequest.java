
package com.stancloud.cloud_backend.dto;

import lombok.Data;

@Data
public class UpdateFileRequest {
    private String filename;

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}

