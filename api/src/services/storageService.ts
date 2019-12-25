import azure from 'azure-storage';

export class StorageService {
  private blobService: azure.BlobService;
  constructor(accountName: string, accountKey: string) {
    this.blobService = azure.createBlobService(accountName, accountKey);
  }

  public async getBlobText(container: string, blobname: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.blobService.getBlobToText(container, blobname, (error, text) => {
        if (error) {
          reject(error);
        } else {
          resolve(text);
        }
      });
    });
  }
}

export default (accountName: string, accountKey: string) => new StorageService(accountName, accountKey);
