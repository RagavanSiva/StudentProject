import { Injectable } from '@angular/core';
import { StudentInterface } from './interfaces';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class StudentServiceService {
  constructor(private http: HttpClient) {}

  createPost(data) {
    return this.http.post('http://localhost:5000/student/add', data);
  }

  getAllPosts() {
    return this.http.get('http://localhost:5000/student/getAll');
  }

  deletePost(id) {
    return this.http.delete(`http://localhost:5000/student/delete/${id}`);
  }
  updatePost(data) {
    return this.http.put('http://localhost:5000/student/update', data);
  }
}
