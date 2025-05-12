import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [SkeletonComponent, FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  title = 'gemini-inte';
  prompt: string = '';
  geminiService: GeminiService = inject(GeminiService);
  loading: boolean = false;
  chatHistory: any[] = [];

  // Get reference to the chat history container element
  @ViewChild('chatHistoryContainer') private chatHistoryContainer!: ElementRef;

  constructor() {
    this.geminiService.getMessageHistory().subscribe((res) => {
      if(res) {
        this.chatHistory.push(res);
        // Scroll down is handled by ngAfterViewChecked now
      }
    });
  }

  // This lifecycle hook is called after Angular checks the component's views and child views.
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async sendData() {
    if(this.prompt && !this.loading) {
      const messageToSend = this.prompt; // Store before clearing
      this.prompt = ''; // Clear input immediately for better UX
      this.loading = true;
       // Manually add user message to history *before* sending to service
       // This makes the UI feel more responsive
       //this.chatHistory.push({ from: 'user', message: messageToSend });
       // Allow Angular to render the new user message before potential loading state or API call
       // setTimeout helps ensure rendering cycle completes before API call potentially blocks
       setTimeout(async () => {
           try {
             await this.geminiService.generateText(messageToSend);
           } catch (error) {
             console.error("Error sending message:", error);
             // Optionally add an error message to chatHistory
             this.chatHistory.push({ from: 'bot', message: 'Sorry, an error occurred.' });
           } finally {
             this.loading = false;
             // Scroll down handled by ngAfterViewChecked
           }
       }, 0);


    }
  }

  formatText(text: string): string {
    // Basic formatting: replace newlines with <br> and remove potential markdown asterisks
    // You might want a more robust Markdown parser here if the bot returns complex markdown
    const withLineBreaks = text.replace(/\n/g, '<br>');
    const withoutAsterisks = withLineBreaks.replace(/\*/g, ''); // Remove all asterisks
    // Consider adding more formatting rules if needed
    return withoutAsterisks;
  }

  // Method to scroll the chat history to the bottom
  private scrollToBottom(): void {
    try {
      this.chatHistoryContainer.nativeElement.scrollTop = this.chatHistoryContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error("Could not scroll to bottom:", err);
    }
  }
}