import { Dialog, DialogContent, Grid } from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";
import moment, { Moment } from "moment";
import { Adherent } from "../../model/Adherent";
import { Attribution } from "../../model/Attribution";
import { HeaderParcelle } from "../../pages/admin/BilanPage";
import { AdhPDF } from "../../pdf/AdhPDF";
import { InvitationPDF } from "../../pdf/InvitationPDF";
import { PouvoirPDF } from "../../pdf/PouvoirPDF";

interface Props {
  open: boolean;
  close: () => void;
  attributions: Array<Attribution>;
  headersParcelle: Array<HeaderParcelle>;
  adherent: Adherent;
  resolutions: Array<string>;
  ordresdujour: Array<string>;
  lieu: string;
  president: string;
  date: Moment;
}

export const ApercuPDFDialog = ({
  adherent,
  headersParcelle,
  attributions,
  resolutions,
  ordresdujour,
  date,
  president,
  lieu,
  open,
  close,
}: Props) => {
  return (
    <Dialog onClose={close} open={open} maxWidth="lg">
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PDFViewer width={"100%"} height={700}>
              <PouvoirPDF
                date={date}
                lieu={lieu}
                resolutions={resolutions}
                adherent={adherent}
              />
            </PDFViewer>
          </Grid>
          <Grid item xs={12}>
            <PDFViewer width={"100%"} height={700}>
              <InvitationPDF
                date={date}
                president={president}
                lieu={lieu}
                ordredujour={ordresdujour}
              />
            </PDFViewer>
          </Grid>
          <Grid item xs={12}>
            <PDFViewer width={"100%"} height={700}>
              <AdhPDF
                date={date}
                adherent={adherent}
                attributions={attributions}
                headersParcelle={headersParcelle}
              />
            </PDFViewer>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
