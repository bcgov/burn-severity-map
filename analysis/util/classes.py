class ImageMetadata:
    def __init__(self, fire_number: str = '', fire_year: int = None) -> None:
        self.fire_number = fire_number
        self.fire_year = fire_year
        self.fire_image = ''
        self.fire_image_date = None


class Fire:
    def __init__(self, fire_num, fire_year, pre_start_date, pre_end_date, post_start_date, post_end_date) -> None:
        self.fire_number = fire_num
        self.fire_year = fire_year
        self.pre_start_date = pre_start_date
        self.pre_end_date = pre_end_date
        self.post_start_date = post_start_date
        self.post_end_date = post_end_date
        self.pre_cloud = ''
        self.post_cloud = ''
        self.pre_mosaic_date = ''
        self.post_mosaic_date = ''
        self.lst_pre_image = []
        self.lst_post_image = []
        self.lst_pre_dates = []
        self.lst_post_dates = []


    def get_pre_date_range(self):
        return f"{self.pre_start_date.strftime('%Y-%m-%dT00:00:00Z')}/{self.pre_end_date .strftime('%Y-%m-%dT23:59:59Z')}"
    
    def get_post_date_range(self):
        return f"{self.post_start_date.strftime('%Y-%m-%dT00:00:00Z')}/{self.post_end_date .strftime('%Y-%m-%dT23:59:59Z')}"
