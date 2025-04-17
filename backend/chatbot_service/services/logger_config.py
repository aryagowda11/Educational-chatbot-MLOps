import logging
from pathlib import Path
from contextlib import contextmanager
from datetime import datetime

class ContextLogger:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)
        self.original_handlers = []

    @contextmanager
    def scoped_logger(self, user_id: str, video_id: str):
        """Context manager for scoped logging"""
        try:
            date_str = datetime.today().strftime('%Y-%m-%d')

            # Create directory structure
            log_dir = Path("functional logs")
            log_dir.mkdir(parents=True, exist_ok=True)
            
            # Configure dynamic filename
            log_file = log_dir / f"{user_id}_{video_id}_{date_str}_logs.log"
            
            # Create file handler
            file_handler = logging.FileHandler(log_file)
            file_handler.setFormatter(logging.Formatter(
                "%(asctime)s - %(funcName)s - %(levelname)s - %(message)s"
            ))
            
            # Store original handlers
            self.original_handlers = self.logger.handlers.copy()
            
            # Clear existing handlers and add new one
            self.logger.handlers = [file_handler]
            
            yield self.logger
            
        finally:
            # Restore original handlers
            self.logger.handlers = self.original_handlers
            file_handler.close()

# Global instance
context_logger = ContextLogger()
